if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    sessionStorage.setItem('ellie_dest', 'auth.html');
    window.location.replace('desktop-only.html');
}
