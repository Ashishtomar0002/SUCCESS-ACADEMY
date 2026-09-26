// navbar script 

const menu_btn = document.querySelector(".menu-btn");
const bookmarks = document.querySelector(".bookmarks");

menu_btn.addEventListener("click", () => {
    bookmarks.classList.toggle("active");
});

// page loading animation
const hiddenelements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    })
})
hiddenelements.forEach((Element) => {
    observer.observe(Element);
})




// notes section



function updateNotesCount() {
    const grid = document.getElementById('notes-grid');
    const n = grid.children.length;
    document.getElementById('notes-count').textContent = n + (n === 1 ? ' note' : ' notes');
    document.getElementById('empty-state').style.display = n === 0 ? 'block' : 'none';
}



async function loadNotes() {
    try {
        const response = await fetch("https://success-academy-jz9x.onrender.com/api/notes");
        const notes = await response.json();

        const grid = document.getElementById("notes-grid");
        grid.innerHTML = "";

        notes.forEach(note => {
            const card = document.createElement("div");
            card.className = "note-card";
            card.dataset.id = note._id;

            card.innerHTML = `
                <div class="note-tab tab-math"></div>

                <div class="note-body">
                    <div class="note-subject">
                        ${note.subject} · ${note.grade}
                    </div>

                    <div class="note-title">
                        ${note.title}
                    </div>

                    <div class="note-meta">
                        <span>Uploaded recently</span>
                        <a href="${note.fileUrl || '#'}" class="note-download">
                            ↓ PDF
                        </a>
                        
                    </div>
                </div>
            `;

            grid.appendChild(card);
        });

        updateNotesCount();

    } catch (error) {
        console.error("Failed to load notes:", error);
    }
}
console.log("LOAD NOTES FUNCTION REACHED");

loadNotes();

// video tutorial section

async function loadVideos() {
    try {
        const response = await fetch("https://success-academy-jz9x.onrender.com/api/videos");
        const videos = await response.json();

        const grid = document.getElementById("video-grid");
        grid.innerHTML = "";

        videos.forEach(video => {

            const card = document.createElement("div");
            card.className = "video-card";
            card.dataset.id = video._id;

            const thumb = thumbPool[Math.floor(Math.random() * thumbPool.length)];

            card.innerHTML = `
                <div class="thumb-wrap">

                    <div class="perf top">
                        <span></span><span></span><span></span><span></span>
                        <span></span><span></span><span></span><span></span>
                    </div>

                    <img src="${thumb}" alt="Video thumbnail">

                    <button class="play-btn" onclick="playVideo(this, '${video.videoUrl}')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1D2B4F">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </button>

                    <div class="duration-badge">VIDEO</div>

                    <div class="perf bottom">
                        <span></span><span></span><span></span><span></span>
                        <span></span><span></span><span></span><span></span>
                    </div>

                </div>

                <div class="video-info">
                    <div class="video-subject">${video.subject}</div>

                    <div class="video-title">${video.title}</div>

                    <div class="video-meta">
                        <span>Uploaded recently</span>

                        <button class="video-delete" onclick="deleteVideo(this)">
                            &#10005; Delete
                        </button>
                    </div>
                </div>
            `;

            grid.appendChild(card);
        });

        updateCount();

    } catch (error) {
        console.error("Failed to load videos:", error);
    }
}

loadVideos();








const thumbPool = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=600&auto=format&fit=crop&q=80"
];



function updateCount() {

    const grid = document.getElementById('video-grid');

    const n = grid.children.length;

    document.getElementById('video-count').textContent =
        n + (n === 1 ? ' video' : ' videos');

}



function playVideo(btn, url) {
    const inner = document.getElementById('lightbox-inner');

    if (url) {
        inner.innerHTML = `<button class="lightbox-close" onclick="closeLightbox()">&times;</button><video src="${url}" controls autoplay></video>`;
    } else {
        inner.innerHTML = `<button class="lightbox-close" onclick="closeLightbox()">&times;</button><div class="lightbox-msg">This is a sample card &mdash; upload a real video file above to enable playback here.</div>`;
    }

    document.getElementById('lightbox').classList.add('open');

    history.pushState({ lightbox: true }, "");
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.getElementById('lightbox-inner').innerHTML =
        '<button class="lightbox-close" onclick="closeLightbox()">&times;</button>';

    if (history.state && history.state.lightbox) {
        history.back();
    }
}
window.addEventListener("popstate", () => {
    const lightbox = document.getElementById("lightbox");

    if (lightbox.classList.contains("open")) {
        lightbox.classList.remove("open");

        document.getElementById("lightbox-inner").innerHTML =
            '<button class="lightbox-close" onclick="closeLightbox()">&times;</button>';
    }
});


// student testimony 
const photoInput = document.getElementById('testimony-photo');
const photoPreview = document.getElementById('photo-preview');
const photoPlaceholder = document.getElementById('photo-placeholder');
const nameInput = document.getElementById('testimony-name');
const textInput = document.getElementById('testimony-text');
const submitBtn = document.getElementById('testimony-submit');
let chosenPhoto = null;

function checkFormReady() {
    submitBtn.disabled = !(nameInput.value.trim() && textInput.value.trim());
}

photoInput.addEventListener('change', (e) => {
    chosenPhoto = e.target.files[0] || null;
    if (chosenPhoto) {
        const url = URL.createObjectURL(chosenPhoto);
        photoPreview.src = url;
        photoPreview.style.display = 'block';
        photoPlaceholder.style.display = 'none';
    } else {
        photoPreview.style.display = 'none';
        photoPlaceholder.style.display = 'block';
    }
});

nameInput.addEventListener('input', checkFormReady);
textInput.addEventListener('input', checkFormReady);

submitBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    if (!name || !text) return;

    const photoUrl = chosenPhoto
        ? URL.createObjectURL(chosenPhoto)
        : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80';

    const grid = document.getElementById('testimonial-grid');
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `
      <div class="quote-mark">&ldquo;</div>
      <p class="testimony-text">${text}</p>
      <div class="testimonial-person">
        <img src="${photoUrl}" alt="Student photo">
        <div>
          <div class="person-name">${name}</div>
          <div class="person-meta"> student</div>
        </div>
      </div>`;
    grid.prepend(card);
    document.getElementById('empty-state').style.display = 'none';

    // reset form
    chosenPhoto = null;
    photoInput.value = '';
    photoPreview.style.display = 'none';
    photoPlaceholder.style.display = 'block';
    nameInput.value = '';
    textInput.value = '';
    submitBtn.disabled = true;
});



const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
});