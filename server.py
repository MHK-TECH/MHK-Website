import os
import re
import time
import json
import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from functools import wraps
from flask import Flask, request, jsonify, send_from_directory, Response
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv(override=True)

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app, origins=['http://localhost:8000', 'https://mhktech.dev', 'https://www.mhktech.dev'])

API_KEY = os.getenv('OPENROUTER_API_KEY')
API_URL = 'https://openrouter.ai/api/v1/chat/completions'
SMTP_EMAIL = os.getenv('SMTP_EMAIL')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')

BLOCKED_FILES = ['.env', 'server.py', 'requirements.txt', '.git', '__pycache__', '.gitignore']

# Vercel Web Analytics snippet (injected into every HTML page so all traffic is tracked)
ANALYTICS_SNIPPET = '''<!-- Vercel Analytics -->
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
'''

def serve_html(filename):
    filepath = os.path.join('.', filename)
    if not os.path.isfile(filepath):
        return jsonify({'error': 'Not found'}), 404
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    # Inject analytics once, before </head>, if not already present
    if ANALYTICS_SNIPPET.strip() not in content and '</head>' in content:
        content = content.replace('</head>', ANALYTICS_SNIPPET + '</head>', 1)
    return Response(content, mimetype='text/html; charset=utf-8')

@app.route('/')
def index():
    return serve_html('index.html')

@app.route('/<path:path>')
def static_files(path):
    for blocked in BLOCKED_FILES:
        if path == blocked or path.startswith(blocked + '/') or path.startswith(blocked + '\\'):
            return jsonify({'error': 'Not found'}), 404
    # HTML pages get the analytics snippet injected; everything else is served as-is
    if path.endswith('.html'):
        return serve_html(path)
    return send_from_directory('.', path)

# Rate limiting
rate_limit_store = {}
def rate_limit(max_requests=10, window=60):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            ip = request.remote_addr
            now = time.time()
            if ip not in rate_limit_store:
                rate_limit_store[ip] = []
            rate_limit_store[ip] = [t for t in rate_limit_store[ip] if now - t < window]
            if len(rate_limit_store[ip]) >= max_requests:
                return jsonify({'error': 'Too many requests. Please try again later.'}), 429
            rate_limit_store[ip].append(now)
            return f(*args, **kwargs)
        return wrapper
    return decorator

def sanitize_input(text, max_length=500):
    if not isinstance(text, str):
        return ''
    text = text.strip()[:max_length]
    text = re.sub(r'[\r\n]{3,}', '\n\n', text)
    return text

def is_valid_email(email):
    return bool(re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email))

FALLBACK_MODELS = [
    'google/gemma-4-26b-a4b-it:free',
    'inclusionai/ling-3.0-flash:free',
    'openrouter/free'
]

@app.route('/api/chat', methods=['POST'])
@rate_limit(max_requests=20, window=60)
def chat():
    data = request.json
    if not data:
        return jsonify({'error': 'Invalid request'}), 400

    messages = data.get('messages', [])
    if not messages:
        return jsonify({'error': 'No messages provided'}), 400

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {API_KEY}',
        'HTTP-Referer': request.headers.get('Origin', 'https://mhktech.dev'),
        'X-Title': 'MHK AI Assistant'
    }

    for model in FALLBACK_MODELS:
        payload = {
            'model': model,
            'messages': messages,
            'max_tokens': 500,
            'temperature': 0.7
        }
        try:
            r = requests.post(API_URL, headers=headers, json=payload, timeout=60)
            result = r.json()
            if result.get('choices'):
                return jsonify(result)
        except Exception as e:
            continue

    return jsonify({'error': 'All models unavailable'}), 503

@app.route('/api/contact', methods=['POST'])
@rate_limit(max_requests=5, window=60)
def contact():
    data = request.json
    if not data:
        return jsonify({'error': 'Invalid request'}), 400

    name = sanitize_input(data.get('name', ''), 100)
    email = sanitize_input(data.get('email', ''), 150)
    phone = sanitize_input(data.get('phone', ''), 20)
    service = sanitize_input(data.get('service', ''), 100)
    budget = sanitize_input(data.get('budget', ''), 50)
    message = sanitize_input(data.get('message', ''), 2000)

    if not name or not email or not message:
        return jsonify({'error': 'Name, email, and message are required'}), 400

    if not is_valid_email(email):
        return jsonify({'error': 'Invalid email address'}), 400

    msg = MIMEMultipart()
    msg['From'] = SMTP_EMAIL
    msg['To'] = 'huzaifa@mhktech.dev'
    msg['Reply-To'] = email
    msg['Subject'] = f'New Contact Form: {service} from {name}'

    body = f"""New message from your website contact form:

Name: {name}
Email: {email}
Phone: {phone}
Service: {service}
Budget: {budget}

Message:
{message}
"""
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, SMTP_EMAIL, msg.as_string())
        server.quit()
        return jsonify({'success': True})
    except Exception:
        return jsonify({'error': 'Failed to send message'}), 500

if __name__ == '__main__':
    print('Server running at http://localhost:8000')
    app.run(host='127.0.0.1', port=8000, debug=False)
