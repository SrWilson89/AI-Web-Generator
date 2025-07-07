// ===== GLOBAL VARIABLES =====
let currentGeneratedCode = {
    html: '',
    css: '',
    js: ''
};

let currentCodeLanguage = 'html';
let isGenerating = false;

// ===== DOM ELEMENTS =====
const elements = {
    generateBtn: document.getElementById('generateBtn'),
    websiteDescription: document.getElementById('websiteDescription'),
    loadingSection: document.getElementById('loadingSection'),
    resultsSection: document.getElementById('resultsSection'),
    progressBar: document.getElementById('progressBar'),
    codeContent: document.getElementById('codeContent'),
    livePreview: document.getElementById('livePreview'),
    copyCodeBtn: document.getElementById('copyCodeBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    regenerateBtn: document.getElementById('regenerateBtn'),
    customizeBtn: document.getElementById('customizeBtn'),
    shareBtn: document.getElementById('shareBtn'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    previewContainer: document.getElementById('previewContainer'),
    toastContainer: document.getElementById('toastContainer')
};

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setupCodeTabs();
    setupPreviewControls();
    setupExamples();
});

function initializeEventListeners() {
    // Generate button
    elements.generateBtn.addEventListener('click', handleGenerate);
    
    // Enter key on input
    elements.websiteDescription.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !isGenerating) {
            handleGenerate();
        }
    });
    
    // Action buttons
    elements.copyCodeBtn.addEventListener('click', copyCode);
    elements.downloadBtn.addEventListener('click', downloadCode);
    elements.regenerateBtn.addEventListener('click', regenerateCode);
    elements.customizeBtn.addEventListener('click', showCustomizeModal);
    elements.shareBtn.addEventListener('click', shareCode);
    elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
}

function setupCodeTabs() {
    const codeTabs = document.querySelectorAll('.code-tab');
    codeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const language = this.getAttribute('data-lang');
            switchCodeTab(language);
        });
    });
}

function switchCodeTab(language) {
    // Update active tab
    document.querySelectorAll('.code-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-lang="${language}"]`).classList.add('active');
    
    // Update code content
    currentCodeLanguage = language;
    updateCodeDisplay();
}

function updateCodeDisplay() {
    const code = currentGeneratedCode[currentCodeLanguage] || '';
    elements.codeContent.textContent = code;
    
    // Update language class for syntax highlighting
    const pre = document.getElementById('generatedCode');
    pre.className = `language-${currentCodeLanguage}`;
    
    // Highlight code if Prism is available
    if (window.Prism) {
        Prism.highlightElement(elements.codeContent);
    }
}

function setupPreviewControls() {
    const desktopView = document.getElementById('desktopView');
    const tabletView = document.getElementById('tabletView');
    const mobileView = document.getElementById('mobileView');
    
    desktopView.addEventListener('click', () => setPreviewMode('desktop'));
    tabletView.addEventListener('click', () => setPreviewMode('tablet'));
    mobileView.addEventListener('click', () => setPreviewMode('mobile'));
}

function setPreviewMode(mode) {
    // Update active button
    document.querySelectorAll('#desktopView, #tabletView, #mobileView').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${mode}View`).classList.add('active');
    
    // Update preview container
    elements.previewContainer.className = `preview-container ${mode === 'desktop' ? '' : mode}`;
}

function setupExamples() {
    const exampleButtons = document.querySelectorAll('.example-btn');
    exampleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const example = this.getAttribute('data-example');
            elements.websiteDescription.value = example;
            
            // Animate the input
            elements.websiteDescription.style.transform = 'scale(1.02)';
            setTimeout(() => {
                elements.websiteDescription.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

// ===== MAIN GENERATION FUNCTION =====
async function handleGenerate() {
    const description = elements.websiteDescription.value.trim();
    
    if (!description) {
        showToast('Error', 'Por favor, ingresa una descripción para generar el sitio web.', 'danger');
        return;
    }
    
    if (isGenerating) {
        return;
    }
    
    isGenerating = true;
    showLoadingState();
    
    try {
        const generatedCode = await generateWebsite(description);
        currentGeneratedCode = generatedCode;
        
        hideLoadingState();
        showResults();
        updateCodeDisplay();
        updatePreview();
        
        showToast('¡Éxito!', 'Sitio web generado correctamente', 'success');
        
    } catch (error) {
        console.error('Error generating website:', error);
        hideLoadingState();
        showToast('Error', 'Hubo un problema al generar el sitio web. Inténtalo de nuevo.', 'danger');
    } finally {
        isGenerating = false;
    }
}

// ===== WEBSITE GENERATION API =====
async function generateWebsite(description) {
    // Simulate API call with realistic delay and progress
    await simulateProgress();
    
    const templates = [
        {
            name: 'modern',
            html: generateModernTemplate(description),
            css: generateModernCSS(),
            js: generateModernJS()
        },
        {
            name: 'minimal',
            html: generateMinimalTemplate(description),
            css: generateMinimalCSS(),
            js: generateMinimalJS()
        },
        {
            name: 'creative',
            html: generateCreativeTemplate(description),
            css: generateCreativeCSS(),
            js: generateCreativeJS()
        }
    ];
    
    // Select template based on description keywords
    const selectedTemplate = selectTemplate(description, templates);
    
    return {
        html: selectedTemplate.html,
        css: selectedTemplate.css,
        js: selectedTemplate.js
    };
}

function selectTemplate(description, templates) {
    const desc = description.toLowerCase();
    
    if (desc.includes('minimalista') || desc.includes('clean') || desc.includes('simple')) {
        return templates[1]; // minimal
    } else if (desc.includes('creativo') || desc.includes('artístico') || desc.includes('portfolio')) {
        return templates[2]; // creative
    } else {
        return templates[0]; // modern
    }
}

async function simulateProgress() {
    const steps = [
        { text: 'Analizando descripción...', progress: 20 },
        { text: 'Generando estructura HTML...', progress: 40 },
        { text: 'Creando estilos CSS...', progress: 60 },
        { text: 'Añadiendo interactividad...', progress: 80 },
        { text: 'Optimizando código...', progress: 100 }
    ];
    
    for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        elements.progressBar.style.width = `${step.progress}%`;
        
        const loadingText = elements.loadingSection.querySelector('p');
        if (loadingText) {
            loadingText.textContent = step.text;
        }
    }
}

// ===== TEMPLATE GENERATORS =====
function generateModernTemplate(description) {
    const title = extractTitleFromDescription(description);
    const theme = extractThemeFromDescription(description);
    
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* CSS personalizado se insertará aquí */
    </style>
</head>
<body>
    <!-- Navegación -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="#">${title}</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="#inicio">Inicio</a></li>
                    <li class="nav-item"><a class="nav-link" href="#servicios">Servicios</a></li>
                    <li class="nav-item"><a class="nav-link" href="#about">Acerca de</a></li>
                    <li class="nav-item"><a class="nav-link" href="#contacto">Contacto</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="inicio" class="hero-section">
        <div class="container">
            <div class="row align-items-center min-vh-100">
                <div class="col-lg-6">
                    <h1 class="display-4 fw-bold mb-4">Bienvenido a ${title}</h1>
                    <p class="lead mb-4">${generateDescriptionText(description)}</p>
                    <div class="d-flex gap-3">
                        <button class="btn btn-primary btn-lg">Comenzar</button>
                        <button class="btn btn-outline-primary btn-lg">Más información</button>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="hero-image">
                        <img src="https://via.placeholder.com/600x400/007bff/ffffff?text=Hero+Image" 
                             alt="Hero" class="img-fluid rounded shadow">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Servicios -->
    <section id="servicios" class="py-5 bg-light">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto text-center mb-5">
                    <h2 class="display-5 fw-bold">Nuestros Servicios</h2>
                    <p class="lead">Ofrecemos soluciones ${theme} de alta calidad</p>
                </div>
            </div>
            <div class="row g-4">
                ${generateServiceCards(theme)}
            </div>
        </div>
    </section>

    <!-- About -->
    <section id="about" class="py-5">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <img src="https://via.placeholder.com/500x400/6c757d/ffffff?text=About+Us" 
                         alt="Sobre nosotros" class="img-fluid rounded shadow">
                </div>
                <div class="col-lg-6">
                    <h2 class="display-5 fw-bold mb-4">Sobre Nosotros</h2>
                    <p class="lead mb-4">Somos expertos en ${theme} con años de experiencia en el sector.</p>
                    <ul class="list-unstyled">
                        <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Calidad garantizada</li>
                        <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Atención personalizada</li>
                        <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Resultados excepcionales</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- Contacto -->
    <section id="contacto" class="py-5 bg-primary text-white">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto text-center">
                    <h2 class="display-5 fw-bold mb-4">¿Listo para comenzar?</h2>
                    <p class="lead mb-4">Contáctanos hoy mismo y descubre cómo podemos ayudarte</p>
                    <button class="btn btn-light btn-lg">Contactar ahora</button>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5>${title}</h5>
                    <p class="mb-0">© 2024 Todos los derechos reservados</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <div class="social-links">
                        <a href="#" class="text-white me-3"><i class="bi bi-facebook"></i></a>
                        <a href="#" class="text-white me-3"><i class="bi bi-twitter"></i></a>
                        <a href="#" class="text-white me-3"><i class="bi bi-instagram"></i></a>
                        <a href="#" class="text-white"><i class="bi bi-linkedin"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // JavaScript personalizado se insertará aquí
    </script>
</body>
</html>`;
}

function generateMinimalTemplate(description) {
    const title = extractTitleFromDescription(description);
    
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        /* CSS minimalista se insertará aquí */
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-brand">${title}</div>
            <ul class="nav-links">
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#about">Acerca de</a></li>
                <li><a href="#contacto">Contacto</a></li>
            </ul>
        </nav>
    </header>

    <main class="main">
        <section class="hero">
            <div class="container">
                <h1 class="hero-title">${title}</h1>
                <p class="hero-subtitle">${generateDescriptionText(description)}</p>
                <button class="btn-primary">Comenzar</button>
            </div>
        </section>

        <section class="content">
            <div class="container">
                <h2>Simplicidad y elegancia</h2>
                <p>Diseño minimalista que se enfoca en lo esencial, sin distracciones.</p>
                
                <div class="grid">
                    <div class="card">
                        <h3>Diseño Clean</h3>
                        <p>Interfaz limpia y moderna que mejora la experiencia del usuario.</p>
                    </div>
                    <div class="card">
                        <h3>Rápido</h3>
                        <p>Optimizado para velocidad y rendimiento excepcional.</p>
                    </div>
                    <div class="card">
                        <h3>Responsivo</h3>
                        <p>Se adapta perfectamente a cualquier dispositivo.</p>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${title}. Todos los derechos reservados.</p>
        </div>
    </footer>

    <script>
        // JavaScript minimalista se insertará aquí
    </script>
</body>
</html>`;
}

function generateCreativeTemplate(description) {
    const title = extractTitleFromDescription(description);
    
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        /* CSS creativo se insertará aquí */
    </style>
</head>
<body>
    <div class="creative-container">
        <nav class="creative-nav">
            <div class="nav-logo">${title}</div>
            <div class="nav-menu">
                <a href="#inicio" class="nav-link">Inicio</a>
                <a href="#portfolio" class="nav-link">Portfolio</a>
                <a href="#about" class="nav-link">Sobre mí</a>
                <a href="#contacto" class="nav-link">Contacto</a>
            </div>
        </nav>

        <section class="creative-hero">
            <div class="hero-content">
                <h1 class="hero-title">${title}</h1>
                <p class="hero-subtitle">${generateDescriptionText(description)}</p>
                <div class="hero-cta">
                    <button class="btn-creative">Ver Portfolio</button>
                </div>
            </div>
            <div class="hero-visual">
                <div class="floating-elements">
                    <div class="element element-1"></div>
                    <div class="element element-2"></div>
                    <div class="element element-3"></div>
                </div>
            </div>
        </section>

        <section class="portfolio-section">
            <div class="container">
                <h2 class="section-title">Portfolio Creativo</h2>
                <div class="portfolio-grid">
                    <div class="portfolio-item">
                        <img src="https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Proyecto+1" alt="Proyecto 1">
                        <div class="portfolio-overlay">
                            <h3>Proyecto Creativo 1</h3>
                            <p>Descripción del proyecto</p>
                        </div>
                    </div>
                    <div class="portfolio-item">
                        <img src="https://via.placeholder.com/400x300/4ecdc4/ffffff?text=Proyecto+2" alt="Proyecto 2">
                        <div class="portfolio-overlay">
                            <h3>Proyecto Creativo 2</h3>
                            <p>Descripción del proyecto</p>
                        </div>
                    </div>
                    <div class="portfolio-item">
                        <img src="https://via.placeholder.com/400x300/45b7d1/ffffff?text=Proyecto+3" alt="Proyecto 3">
                        <div class="portfolio-overlay">
                            <h3>Proyecto Creativo 3</h3>
                            <p>Descripción del proyecto</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="contact-section">
            <div class="container">
                <h2 class="section-title">¿Trabajamos juntos?</h2>
                <p class="contact-text">Estoy disponible para nuevos proyectos creativos</p>
                <button class="btn-creative">Contactar</button>
            </div>
        </section>
    </div>

    <script>
        // JavaScript creativo se insertará aquí
    </script>
</body>
</html>`;
}

// ===== CSS GENERATORS =====
function generateModernCSS() {
    return `/* CSS Moderno */
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --white: #ffffff;
    --light: #f8f9fa;
    --dark: #343a40;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: var(--dark);
}

.hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 120px 0 80px;
}

.hero-image img {
    transition: transform 0.3s ease;
}

.hero-image img:hover {
    transform: scale(1.05);
}

.btn {
    border-radius: 50px;
    padding: 12px 30px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.service-card {
    background: white;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.service-card:hover {
    transform: translateY(-10px);
}

.service-icon {
    width: 60px;
    height: 60px;
    background: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    font-size: 24px;
    color: white;
}

@media (max-width: 768px) {
    .hero-section {
        padding: 80px 0 60px;
    }
    
    .display-4 {
        font-size: 2.5rem;
    }
}`;
}

function generateMinimalCSS() {
    return `/* CSS Minimalista */
:root {
    --black: #000000;
    --white: #ffffff;
    --gray: #f5f5f5;
    --text: #333333;
    --border: #e0e0e0;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.6;
    color: var(--text);
    background: var(--white);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.header {
    border-bottom: 1px solid var(--border);
    padding: 20px 0;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-brand {
    font-size: 24px;
    font-weight: 600;
    color: var(--black);
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 30px;
}

.nav-links a {
    text-decoration: none;
    color: var(--text);
    font-weight: 400;
    transition: color 0.3s ease;
}

.nav-links a:hover {
    color: var(--black);
}

.hero {
    padding: 100px 0;
    text-align: center;
}

.hero-title {
    font-size: 48px;
    font-weight: 300;
    margin-bottom: 20px;
    color: var(--black);
}

.hero-subtitle {
    font-size: 20px;
    color: var(--text);
    margin-bottom: 40px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.btn-primary {
    background: var(--black);
    color: var(--white);
    border: none;
    padding: 15px 40px;
    font-size: 16px;
    cursor: pointer;
    transition: opacity 0.3s ease;
}

.btn-primary:hover {
    opacity: 0.8;
}

.content {
    padding: 80px 0;
}

.content h2 {
    font-size: 36px;
    font-weight: 300;
    margin-bottom: 20px;
    text-align: center;
}

.content p {
    text-align: center;
    margin-bottom: 60px;
    font-size: 18px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
}

.card {
    text-align: center;
    padding: 40px 20px;
}

.card h3 {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 15px;
}

.footer {
    border-top: 1px solid var(--border);
    padding: 40px 0;
    text-align: center;
    background: var(--gray);
}

@media (max-width: 768px) {
    .nav-links {
        display: none;
    }
    
    .hero-title {
        font-size: 32px;
    }
    
    .hero-subtitle {
        font-size: 18px;
    }
    
    .grid {
        grid-template-columns: 1fr;
    }
}`;
}

function generateCreativeCSS() {
    return `/* CSS Creativo */
:root {
    --primary: #ff6b6b;
    --secondary: #4ecdc4;
    --accent: #45b7d1;
    --dark: #2c3e50;
    --white: #ffffff;
    --gray: #f8f9fa;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: var(--dark);
    overflow-x: hidden;
}

.creative-container {
    position: relative;
}

.creative-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    padding: 20px 0;
}

.nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--primary);
    text-align: center;
    margin-bottom: 15px;
}

.nav-menu {
    display: flex;
    justify-content: center;
    gap: 30px;
}

.nav-link {
    text-decoration: none;
    color: var(--dark);
    font-weight: 500;
    position: relative;
    transition: color 0.3s ease;
}

.nav-link:hover {
    color: var(--primary);
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--primary);
    transition: width 0.3s ease;
}

.nav-link:hover::after {
    width: 100%;
}

.creative-hero {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
}

.hero-content {
    text-align: center;
    z-index: 2;
    color: white;
}

.hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 64px;
    font-weight: 700;
    margin-bottom: 20px;
    animation: fadeInUp 1s ease;
}

.hero-subtitle {
    font-size: 24px;
    margin-bottom: 40px;
    opacity: 0.9;
    animation: fadeInUp 1s ease 0.3s both;
}

.hero-cta {
    animation: fadeInUp 1s ease 0.6s both;
}

.btn-creative {
    background: var(--primary);
    color: white;
    border: none;
    padding: 18px 40px;
    font-size: 18px;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
}

.btn-creative:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(255, 107, 107, 0.4);
}

.floating-elements {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
}

.element {
    position: absolute;
    border-radius: 50%;
    animation: float 6s ease-in-out infinite;
}

.element-1 {
    width: 80px;
    height: 80px;
    background: var(--secondary);
    top: 20%;
    left: 10%;
    animation-delay: 0s;
}

.element-2 {
    width: 60px;
    height: 60px;
    background: var(--accent);
    top: 60%;
    right: 10%;
    animation-delay: 2s;
}

.element-3 {
    width: 100px;
    height: 100px;
    background: var(--primary);
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
}

.portfolio-section {
    padding: 100px 0;
    background: var(--white);
}

.section-title {
    font-family: 'Playfair Display', serif;
    font-size: 48px;
    text-align: center;
    margin-bottom: 80px;
    color: var(--dark);
}

.portfolio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.portfolio-item {
    position: relative;
    overflow: hidden;
    border-radius: 15px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.portfolio-item:hover {
    transform: translateY(-10px);
}

.portfolio-item img {
    width: 100%;
    height: auto;
    transition: transform 0.5s ease;
}

.portfolio-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    padding: 20px;
    text-align: center;
}

.portfolio-overlay h3 {
    font-size: 24px;
    margin-bottom: 10px;
}

.contact-section {
    padding: 100px 0;
    text-align: center;
    background: var(--gray);
}

.contact-text {
    font-size: 20px;
    margin-bottom: 40px;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes float {
    0% {
        transform: translateY(0) rotate(0deg);
    }
    50% {
        transform: translateY(-20px) rotate(5deg);
    }
    100% {
        transform: translateY(0) rotate(0deg);
    }
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 48px;
    }
    
    .portfolio-grid {
        grid-template-columns: 1fr;
    }
}`;
}

// ===== JS GENERATORS =====
function generateModernJS() {
    return `// JavaScript Moderno
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .hero-image img');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (elementPosition < screenPosition) {
                element.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
});`;
}

function generateMinimalJS() {
    return `// JavaScript Minimalista
document.addEventListener('DOMContentLoaded', function() {
    // Simple mobile menu toggle
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>';
    
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.appendChild(menuToggle);
        
        menuToggle.addEventListener('click', function() {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            }
        });
    }
});`;
}

function generateCreativeJS() {
    return `// JavaScript Creativo
document.addEventListener('DOMContentLoaded', function() {
    // Floating elements animation
    const elements = document.querySelectorAll('.element');
    elements.forEach(el => {
        el.style.animationDuration = (6 + Math.random() * 4) + 's';
    });

    // Portfolio item hover effect
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.portfolio-overlay');
        
        item.addEventListener('mouseenter', () => {
            overlay.style.opacity = '1';
            img.style.transform = 'scale(1.1)';
        });
        
        item.addEventListener('mouseleave', () => {
            overlay.style.opacity = '0';
            img.style.transform = 'scale(1)';
        });
    });

    // Scroll reveal animation
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.portfolio-item, .hero-content > *');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;

            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state
    document.querySelectorAll('.portfolio-item, .hero-content > *').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
});`;
}

// ===== HELPER FUNCTIONS =====
function extractTitleFromDescription(description) {
    // Extrae las primeras palabras como título
    const words = description.split(' ');
    if (words.length > 5) {
        return words.slice(0, 3).join(' ') + '...';
    }
    return description.length > 20 ? description.substring(0, 20) + '...' : description;
}

function extractThemeFromDescription(description) {
    // Extrae palabras clave para el tema
    const desc = description.toLowerCase();
    if (desc.includes('negocio') || desc.includes('empresa')) {
        return 'empresariales';
    } else if (desc.includes('tienda') || desc.includes('ecommerce')) {
        return 'de e-commerce';
    } else if (desc.includes('portfolio') || desc.includes('personal')) {
        return 'profesionales';
    } else {
        return 'a medida';
    }
}

function generateDescriptionText(description) {
    // Genera un texto más elaborado basado en la descripción
    const themes = {
        modern: ['innovadora solución', 'experiencia digital', 'plataforma moderna'],
        minimal: ['enfoque minimalista', 'diseño limpio', 'simplicidad elegante'],
        creative: ['visión creativa', 'expresión artística', 'diseño único']
    };
    
    const template = currentGeneratedCode.html.includes('modern') ? 'modern' : 
                     currentGeneratedCode.html.includes('minimal') ? 'minimal' : 'creative';
    
    const randomPhrase = themes[template][Math.floor(Math.random() * themes[template].length)];
    return `Una ${randomPhrase} para ${description.toLowerCase()}.`;
}

function generateServiceCards(theme) {
    const services = {
        business: [
            { name: 'Consultoría', icon: 'bi bi-briefcase' },
            { name: 'Desarrollo', icon: 'bi bi-code-slash' },
            { name: 'Marketing', icon: 'bi bi-megaphone' }
        ],
        creative: [
            { name: 'Diseño', icon: 'bi bi-palette' },
            { name: 'Branding', icon: 'bi bi-tags' },
            { name: 'Fotografía', icon: 'bi bi-camera' }
        ],
        default: [
            { name: 'Web Design', icon: 'bi bi-layout-text-window' },
            { name: 'SEO', icon: 'bi bi-search' },
            { name: 'Soporte', icon: 'bi bi-headset' }
        ]
    };
    
    let selectedServices = services.default;
    if (theme.includes('empresa') || theme.includes('negocio')) {
        selectedServices = services.business;
    } else if (theme.includes('creativo') || theme.includes('artístico')) {
        selectedServices = services.creative;
    }
    
    return selectedServices.map(service => `
        <div class="col-md-4">
            <div class="service-card">
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <h3>${service.name}</h3>
                <p>Servicios ${theme} especializados en ${service.name.toLowerCase()} para tu negocio.</p>
            </div>
        </div>
    `).join('');
}

// ===== UI FUNCTIONS =====
function showLoadingState() {
    elements.loadingSection.style.display = 'block';
    elements.resultsSection.style.display = 'none';
    elements.generateBtn.disabled = true;
    elements.generateBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Generando...';
}

function hideLoadingState() {
    elements.loadingSection.style.display = 'none';
    elements.generateBtn.disabled = false;
    elements.generateBtn.textContent = 'Generar Sitio Web';
}

function showResults() {
    elements.resultsSection.style.display = 'block';
    // Resaltar el código generado
    if (window.Prism) {
        Prism.highlightAll();
    }
}

function showToast(title, message, type) {
    const toast = document.createElement('div');
    toast.className = `toast show align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <strong>${title}</strong><br>${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// ===== ACTION FUNCTIONS =====
function copyCode() {
    const code = currentGeneratedCode[currentCodeLanguage];
    navigator.clipboard.writeText(code).then(() => {
        showToast('Copiado', 'El código se ha copiado al portapapeles', 'success');
    }).catch(err => {
        console.error('Error al copiar:', err);
        showToast('Error', 'No se pudo copiar el código', 'danger');
    });
}

function downloadCode() {
    const code = currentGeneratedCode[currentCodeLanguage];
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `website.${currentCodeLanguage}`;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

function regenerateCode() {
    handleGenerate();
}

function showCustomizeModal() {
    // Implementar lógica para mostrar un modal de personalización
    showToast('Próximamente', 'La función de personalización estará disponible pronto', 'info');
}

function shareCode() {
    if (navigator.share) {
        navigator.share({
            title: 'Mira este sitio web que generé',
            text: 'Generé este sitio web usando el generador automático',
            url: window.location.href
        }).catch(err => {
            console.error('Error sharing:', err);
            showToast('Error', 'No se pudo compartir', 'danger');
        });
    } else {
        // Fallback para navegadores que no soportan Web Share API
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Compartir', 'Enlace copiado al portapapeles', 'info');
        });
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        elements.previewContainer.requestFullscreen().catch(err => {
            console.error('Error al entrar en pantalla completa:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

function updatePreview() {
    const html = currentGeneratedCode.html;
    const css = currentGeneratedCode.css;
    const js = currentGeneratedCode.js;
    
    const previewDoc = elements.livePreview.contentDocument || elements.livePreview.contentWindow.document;
    previewDoc.open();
    previewDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>${js}</script>
        </body>
        </html>
    `);
    previewDoc.close();
}