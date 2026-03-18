const _supabase = supabase.createClient(
    'https://zpwtdnpxmmabgkxzyxsj.supabase.co',
    'sb_publishable_zxERqa7B-E7zroqc1O9Tow_D_yxImgb'
);

_supabase.auth.getSession().then(({ data }) => {
    if (data.session) window.location.href = 'browse.html';
});

function switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach((t, i) => {
        t.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'signup' && i === 1));
    });
    document.getElementById('login-form').classList.toggle('active', tab === 'login');
    document.getElementById('signup-form').classList.toggle('active', tab === 'signup');
}

function showMsg(id, type, text) {
    const el = document.getElementById(id);
    el.className = 'form-msg ' + type + ' show';
    el.textContent = text;
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    showMsg('login-msg', 'success', 'AUTHENTICATING...');
    const { error } = await _supabase.auth.signInWithPassword({ email, password: pass });
    if (error) return showMsg('login-msg', 'error', 'ERR: ' + error.message);
    showMsg('login-msg', 'success', 'LOGIN_SUCCESS — redirecting...');
    setTimeout(() => window.location.href = 'browse.html', 1000);
}

async function handleSignup(e) {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const pass = document.getElementById('signup-pass').value;
    const confirm = document.getElementById('signup-confirm').value;
    if (pass.length < 8) return showMsg('signup-msg', 'error', 'ERR: Password must be at least 8 characters.');
    if (pass !== confirm) return showMsg('signup-msg', 'error', 'ERR: Passwords do not match.');
    showMsg('signup-msg', 'success', 'CREATING_ACCOUNT...');
    const { error } = await _supabase.auth.signUp({ email, password: pass });
    if (error) return showMsg('signup-msg', 'error', 'ERR: ' + error.message);
    showMsg('signup-msg', 'success', 'ACCOUNT_CREATED — check your email to confirm.');
}

async function showForgot() {
    const email = document.getElementById('login-email').value;
    if (!email) return showMsg('login-msg', 'error', 'ERR: Enter your email first.');
    const { error } = await _supabase.auth.resetPasswordForEmail(email);
    if (error) return showMsg('login-msg', 'error', 'ERR: ' + error.message);
    showMsg('login-msg', 'success', 'RESET_LINK — check your email.');
}

async function oauthGoogle() {
    const { error } = await _supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) alert('ERR: ' + error.message);
}

async function oauthGithub() {
    const { error } = await _supabase.auth.signInWithOAuth({ provider: 'github' });
    if (error) alert('ERR: ' + error.message);
}

function checkStrength(val) {
    const fill = document.getElementById('strength-fill');
    const label = document.getElementById('strength-label');
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const levels = [
        { w: '25%', c: '#c0392b', t: 'WEAK' },
        { w: '50%', c: '#e67e22', t: 'FAIR' },
        { w: '75%', c: '#f1c40f', t: 'GOOD' },
        { w: '100%', c: '#27ae60', t: 'STRONG' },
    ];
    const l = levels[Math.max(0, score - 1)];
    fill.style.width = val ? l.w : '0%';
    fill.style.background = l.c;
    label.textContent = val ? l.t : '--';
}
