let menuVisible = false;
let skillsAnimated = false;

const typewriterPhrases = [
    'Web Developer & and font-end back-endsystem Engineer & and DevOps Engineer It Support & and network Engineer Pre-sales Engineer & and Pre-sales หรืองานที่เกียวข้องกับ IT',
];
let typewriterIndex = 0;
let typewriterChar = 0;
let typewriterDeleting = false;

function runTypewriter(){
    const el = document.getElementById('typewriter-text');
    const cursor = document.getElementById('typewriter-cursor');
    if (!el || !cursor) return;

    const currentPhrase = typewriterPhrases[typewriterIndex];
    if (!typewriterDeleting){
        typewriterChar++;
        el.textContent = currentPhrase.substring(0, typewriterChar);
        if (typewriterChar === currentPhrase.length){
            typewriterDeleting = true;
            setTimeout(runTypewriter, 1500);
            return;
        }
    } else {
        typewriterChar--;
        el.textContent = currentPhrase.substring(0, typewriterChar);
        if (typewriterChar === 0){
            typewriterDeleting = false;
            typewriterIndex = (typewriterIndex + 1) % typewriterPhrases.length;
            setTimeout(runTypewriter, 500);
            return;
        }
    }

    const delay = typewriterDeleting ? 60 : 100;
    setTimeout(runTypewriter, delay);
}

function mostrarOcultarMenu(){
    const nav = document.getElementById("nav");
    if(menuVisible){
        nav.className = "";
        menuVisible = false;
    } else {
        nav.className = "responsive";
        menuVisible = true;
    }
}

function seleccionar(){
    document.getElementById("nav").className = "";
    menuVisible = false;
}

function efectoHabilidades(){
    if (skillsAnimated) return;
    const skills = document.getElementById("skills");
    if (!skills) return;
    const distancia_skills = window.innerHeight - skills.getBoundingClientRect().top;
    if (distancia_skills >= 300) {
        const habilidades = document.getElementsByClassName("progreso");
        for (let i = 0; i < habilidades.length; i++) {
            const span = habilidades[i].querySelector("span");
            if (span) {
                const percent = span.textContent.replace("%", "").trim();
                habilidades[i].style.width = percent + "%";
            }
        }
        skillsAnimated = true;
    }
}

function actualizarMenuActivo(){
    const secciones = document.querySelectorAll("section[id]");
    const scrollPos = window.scrollY + 120;
    secciones.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.id;
        const link = document.querySelector(`a.nav-link[href='#${id}']`);
        if (!link) return;
        if (scrollPos >= top && scrollPos < bottom) {
            document.querySelectorAll("a.nav-link").forEach(a => a.classList.remove("active"));
            link.classList.add("active");
        }
    });
}

function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle("dark");
    const icon = document.querySelector(".theme-toggle i");
    if (html.classList.contains("dark")) {
        icon.className = "fa-solid fa-sun";
    } else {
        icon.className = "fa-solid fa-moon";
    }
}

// ไม่มีระบบสร้างไฟล์ PDF ด้วย jsPDF แล้ว - ใช้ลิงก์ตรงจาก Google Drive เรียบร้อย

window.addEventListener("scroll", () => {
    efectoHabilidades();
    actualizarMenuActivo();
});

window.addEventListener("DOMContentLoaded", () => {

    const links = document.querySelectorAll('a.nav-link');
    links.forEach(link => {
        link.addEventListener("click", () => {
            seleccionar();
            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        });
    });
    efectoHabilidades();
    actualizarMenuActivo();

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    const contactSendBtn = document.getElementById('contactSendBtn');
    
    if (contactSendBtn && contactForm) {
        contactSendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (typeof emailjs === 'undefined') {
                alert('Email service is not ready. Please refresh the page.');
                return;
            }
            
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value.trim();
            const message = document.getElementById('contactMessage').value.trim();
            
            if (!email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            const mailtoSubject = encodeURIComponent(subject);
            const mailtoBody = encodeURIComponent(`Email: ${email}\n\n${message}`);
            const mailtoUrl = `mailto:kenvarisyos@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

            window.location.href = mailtoUrl;

            // Reset form and button state
            contactForm.reset();
            contactSendBtn.disabled = false;
            contactSendBtn.innerHTML = 'send<i class="fa-solid fa-paper-plane"></i><span class="overlay"></span>';

        });
    }

    // เริ่ม typewriter effect
    runTypewriter();

    createSnow();
});

function createSnow() {
    const snowContainer = document.getElementById('snow-container');
    if (!snowContainer) return;
    const numberOfFlakes = 50;
    for (let i = 0; i < numberOfFlakes; i++) {
        const flake = document.createElement('div');
        flake.className = 'snow-flake';
        flake.style.left = Math.random() * 100 + '%';
        flake.style.width = (Math.random() * 10 + 5) + 'px';
        flake.style.height = flake.style.width;
        flake.style.animationDuration = (Math.random() * 10 + 10) + 's';
        flake.style.animationDelay = Math.random() * 10 + 's';
        snowContainer.appendChild(flake);
    }
} 