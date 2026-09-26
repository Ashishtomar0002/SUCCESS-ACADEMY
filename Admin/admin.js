const API = 'https://success-academy-jz9x.onrender.com/api';

// ===== LOGIN =====
const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const loginBtn = document.getElementById('login-btn');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || 'Invalid email or password.');
        }

        const data = await res.json();
        localStorage.setItem('teacherToken', data.token);
        enterDashboard();
    } catch (err) {
        loginError.textContent = err.message || 'Could not connect to the server.';
        loginError.style.display = 'block';
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Log in';
    }
});

function enterDashboard() {
    loginScreen.style.display = 'none';
    dashboard.classList.add('active');
    loadNotes();
    loadVideos();
}

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('teacherToken');
    dashboard.classList.remove('active');
    loginScreen.style.display = 'flex';
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
});

// if already logged in from a previous session, skip straight to dashboard
if (localStorage.getItem('teacherToken')) {
    enterDashboard();
}

// ===== SIDEBAR NAVIGATION =====
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('panel-' + btn.dataset.panel).classList.add('active');
    });
});

// ===== NOTES DATA =====
async function loadNotes() {
    const loading = document.getElementById('notes-loading');
    const table = document.getElementById('notes-table');
    const tbody = document.getElementById('notes-tbody');
    const empty = document.getElementById('notes-empty');

    try {
        const res = await fetch(`${API}/notes`);
        const notes = await res.json();
        loading.style.display = 'none';

        document.getElementById('stat-notes').textContent = notes.length;

        if (notes.length === 0) {
            empty.style.display = 'block';
            return;
        }
        table.style.display = 'table';
        tbody.innerHTML = notes.map(note => `
        <tr>
          <td>${note.title}</td>
          <td>${note.subject}</td>
          <td>${note.grade}</td>
          <td>${new Date(note.createdAt).toLocaleDateString()}</td>
          <td><button class="row-delete" onclick="deleteNote('${note._id}', this)">Delete</button></td>
        </tr>`).join('');
    } catch (err) {
        loading.textContent = 'Could not load notes. Is the backend running?';
    }
}

async function deleteNote(id, btn) {
    const token = localStorage.getItem('teacherToken');
    if (!confirm('Delete this note?')) return;
    const res = await fetch(`${API}/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
        btn.closest('tr').remove();
        const remaining = document.getElementById('notes-tbody').children.length;
        document.getElementById('stat-notes').textContent = remaining;
        if (remaining === 0) {
            document.getElementById('notes-table').style.display = 'none';
            document.getElementById('notes-empty').style.display = 'block';
        }
    } else {
        alert('Delete failed.');
    }
}

document.getElementById("admin-note-upload").addEventListener("click", async () => {

    const title = document.getElementById("admin-note-title").value;
    const subject = document.getElementById("admin-note-subject").value;
    const grade = document.getElementById("admin-note-grade").value;
    const file = document.getElementById("admin-note-file").files[0];
    const message = document.getElementById("admin-note-message");
    const token = localStorage.getItem("teacherToken");

    if (!title || !subject || !grade || !file) {
        message.textContent = "Please fill all fields and select a PDF.";
        return;
    }

    try {

        message.textContent = "Uploading...";

        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch(`${API}/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
            throw new Error(uploadData.message || "File upload failed");
        }

        const response = await fetch(`${API}/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                subject,
                grade,
                description: "",
                fileUrl: uploadData.url
            })
        });

        const note = await response.json();

        if (!response.ok) {
            throw new Error(note.message || "Failed to save note");
        }

        message.textContent = "Note uploaded successfully!";

        document.getElementById("admin-note-title").value = "";
        document.getElementById("admin-note-subject").value = "";
        document.getElementById("admin-note-grade").value = "";
        document.getElementById("admin-note-file").value = "";

        await loadNotes();

    } catch (error) {

        console.error("Note upload failed:", error);
        message.textContent = error.message;
    }
});

// ===== VIDEOS DATA =====
async function loadVideos() {
    const loading = document.getElementById('videos-loading');
    const table = document.getElementById('videos-table');
    const tbody = document.getElementById('videos-tbody');
    const empty = document.getElementById('videos-empty');

    try {
        const res = await fetch(`${API}/videos`);
        const videos = await res.json();
        loading.style.display = 'none';

        document.getElementById('stat-videos').textContent = videos.length;

        if (videos.length === 0) {
            empty.style.display = 'block';
            return;
        }
        table.style.display = 'table';
        tbody.innerHTML = videos.map(video => `
        <tr>
          <td>${video.title}</td>
          <td>${video.subject}</td>
          <td>${new Date(video.createdAt).toLocaleDateString()}</td>
          <td><button class="row-delete" onclick="deleteVideo('${video._id}', this)">Delete</button></td>
        </tr>`).join('');
    } catch (err) {
        loading.textContent = 'Could not load videos. Is the backend running?';
    }
}

async function deleteVideo(id, btn) {
    const token = localStorage.getItem('teacherToken');
    if (!confirm('Delete this video?')) return;
    const res = await fetch(`${API}/videos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
        btn.closest('tr').remove();
        const remaining = document.getElementById('videos-tbody').children.length;
        document.getElementById('stat-videos').textContent = remaining;
        if (remaining === 0) {
            document.getElementById('videos-table').style.display = 'none';
            document.getElementById('videos-empty').style.display = 'block';
        }
    } else {
        alert('Delete failed.');
    }
}

// ===== ADD VIDEO =====

document.getElementById("admin-video-upload").addEventListener("click", async () => {

    const title = document.getElementById("admin-video-title").value;
    const subject = document.getElementById("admin-video-subject").value;
    const grade = document.getElementById("admin-video-grade").value;
    const file = document.getElementById("admin-video-file").files[0];

    const message = document.getElementById("admin-video-message");
    const token = localStorage.getItem("teacherToken");

    if (!title || !subject || !file) {
        message.textContent = "Please fill title, subject and select a video.";
        return;
    }

    try {

        message.textContent = "Uploading video...";

        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch(`${API}/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
            throw new Error(uploadData.message || "Video upload failed");
        }

        const response = await fetch(`${API}/videos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                subject,
                grade,
                description: "",
                videoUrl: uploadData.url
            })
        });

        const video = await response.json();

        if (!response.ok) {
            throw new Error(video.message || "Failed to save video");
        }

        message.textContent = "Video uploaded successfully!";

        document.getElementById("admin-video-title").value = "";
        document.getElementById("admin-video-subject").value = "";
        document.getElementById("admin-video-grade").value = "";
        document.getElementById("admin-video-file").value = "";

        await loadVideos();

    } catch (error) {

        console.error("Video upload failed:", error);
        message.textContent = error.message;
    }
});
