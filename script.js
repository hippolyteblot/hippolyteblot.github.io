class AlbumBook {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 11;
        this.isAnimating = false;
        this.isFullscreen = false;
        this.isOnCover = true;
        
        // Déterminer le dossier source des images selon la date
        this.imagesFolder = this.getImagesFolder();
        
        this.init();
    }

    getImagesFolder() {
        const currentDate = new Date();
        const targetDate = new Date('2025-07-28');
        
        // Si on est avant le 28 juillet 2024, utiliser images_old
        if (currentDate < targetDate) {
            return 'images_old';
        } else {
            return 'images';
        }
    }

    updateImageSources() {
        // Mettre à jour tous les chemins d'images dans le HTML
        const allImages = document.querySelectorAll('img[src*="images/"]');
        allImages.forEach(img => {
            const oldSrc = img.src;
            const newSrc = oldSrc.replace(/images\//g, `${this.imagesFolder}/`);
            img.src = newSrc;
        });
    }

    init() {
        this.coverPage = document.querySelector('.cover-page');
        this.spreads = document.querySelectorAll('.spread');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentPageSpan = document.getElementById('currentPage');
        this.totalPagesSpan = document.getElementById('totalPages');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.albumContainer = document.querySelector('.album-container');

        // Mettre à jour les sources d'images selon la date
        this.updateImageSources();

        this.prevBtn.addEventListener('click', () => this.prevPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

        document.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;
            if (e.key === 'ArrowLeft') this.prevPage();
            if (e.key === 'ArrowRight') this.nextPage();
            if (e.key === 'F11') { e.preventDefault(); this.toggleFullscreen(); }
            if (e.key === 'Escape' && this.isFullscreen) this.exitFullscreen();
        });

        // Touch navigation
        let startX = 0;
        this.albumContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        this.albumContainer.addEventListener('touchend', (e) => {
            if (this.isAnimating) return;
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) this.nextPage();
                else this.prevPage();
            }
        });

        this.updateDisplay();
        this.updateNavigation();
        this.preloadImages();
    }

    preloadImages() {
        const allImages = document.querySelectorAll('.page-image, .verso-image');
        allImages.forEach(img => {
            img.addEventListener('load', () => img.classList.remove('loading'));
            img.addEventListener('error', () => console.error(`Erreur de chargement de l'image: ${img.src}`));
        });
    }

    updateDisplay() {
        // Gérer la page de garde
        if (this.currentPage === 1) {
            this.coverPage.classList.remove('hidden');
            this.spreads.forEach(spread => spread.classList.remove('visible', 'top-spread'));
            this.isOnCover = true;
        } else {
            this.coverPage.classList.add('hidden');
            this.isOnCover = false;
            
            // Calculer quel spread afficher
            const spreadIndex = Math.ceil((this.currentPage - 1) / 2) - 1;
            this.spreads.forEach((spread, index) => {
                if (index === spreadIndex) {
                    spread.classList.add('visible');
                } else {
                    spread.classList.remove('visible', 'top-spread');
                }
            });
        }
    }

    updateNavigation() {
        this.currentPageSpan.textContent = this.currentPage;
        this.totalPagesSpan.textContent = this.totalPages;
        this.prevBtn.disabled = this.currentPage === 1;
        this.nextBtn.disabled = this.currentPage === this.totalPages;
    }

    async nextPage() {
        if (this.isAnimating || this.currentPage >= this.totalPages) return;
        this.isAnimating = true;

        if (this.isOnCover) {
            // Passer de la page de garde au premier spread
            await this.transitionFromCoverToSpread();
        } else {
            // Navigation entre les spreads
            await this.nextSpread();
        }

        this.isAnimating = false;
        this.updateNavigation();
    }

    async prevPage() {
        if (this.isAnimating || this.currentPage <= 1) return;
        this.isAnimating = true;

        if (this.currentPage === 2) {
            // Retourner à la page de garde
            await this.transitionFromSpreadToCover();
        } else {
            // Navigation entre les spreads
            await this.prevSpread();
        }

        this.isAnimating = false;
        this.updateNavigation();
    }

    async transitionFromCoverToSpread() {
        this.coverPage.classList.add('hidden');
        this.spreads[0].classList.add('visible');
        this.currentPage = 2;
        this.updateDisplay();
    }

    async transitionFromSpreadToCover() {
        const currentSpread = document.querySelector('.spread.visible');
        if (currentSpread) {
            currentSpread.classList.remove('visible', 'top-spread');
        }
        this.coverPage.classList.remove('hidden');
        this.currentPage = 1;
        this.updateDisplay();
    }

    async nextSpread() {
        const currentSpread = this.getCurrentSpread();
        const nextSpread = this.getNextSpread(currentSpread);
        if (currentSpread && nextSpread) {
            // 1. Mettre le spread courant au-dessus pour l'animation
            currentSpread.classList.add('top-spread');
            // 2. Afficher la page suivante (spread) dès le début
            nextSpread.classList.add('visible');
            // 3. Faire tourner la page de droite du spread actuel
            const rightPage = currentSpread.querySelector('.right-page');
            rightPage.classList.add('flipping');
            
            // Attendre la fin de l'animation
            await this.wait(1000);
            
            // 4. Nettoyer immédiatement pour éviter les flashs
            currentSpread.classList.remove('visible', 'top-spread');
            rightPage.classList.remove('flipping');
            
            // 5. Mettre à jour la page courante
            const nextPages = this.getSpreadPages(nextSpread);
            this.currentPage = nextPages[0] || nextPages[1];
            
            // 6. Forcer la mise à jour de l'affichage
            this.updateDisplay();
        }
    }

    async prevSpread() {
        const currentSpread = this.getCurrentSpread();
        const prevSpread = this.getPrevSpread(currentSpread);
        if (currentSpread && prevSpread) {
            // 1. Mettre le spread précédent au-dessus pour l'animation
            prevSpread.classList.add('visible', 'top-spread');
            // 2. Faire tourner la page de droite du spread précédent dans l'autre sens
            const rightPage = prevSpread.querySelector('.right-page');
            rightPage.style.animationDirection = 'reverse';
            rightPage.classList.add('flipping');
            
            // Attendre la fin de l'animation
            await this.wait(1000);
            
            // 3. Nettoyer immédiatement pour éviter les flashs
            rightPage.classList.remove('flipping');
            rightPage.style.animationDirection = '';
            prevSpread.classList.remove('top-spread');
            currentSpread.classList.remove('visible');
            
            // 4. Mettre à jour la page courante
            const prevPages = this.getSpreadPages(prevSpread);
            this.currentPage = prevPages[1] || prevPages[0];
            
            // 5. Forcer la mise à jour de l'affichage
            this.updateDisplay();
        }
    }

    getCurrentSpread() {
        return document.querySelector('.spread.visible:not(.top-spread)');
    }

    getNextSpread(currentSpread) {
        if (!currentSpread) return null;
        const currentSpreadNum = parseInt(currentSpread.dataset.spread);
        return document.querySelector(`[data-spread="${currentSpreadNum + 1}"]`);
    }

    getPrevSpread(currentSpread) {
        if (!currentSpread) return null;
        const currentSpreadNum = parseInt(currentSpread.dataset.spread);
        return document.querySelector(`[data-spread="${currentSpreadNum - 1}"]`);
    }

    getSpreadPages(spread) {
        if (!spread) return [1, 1];
        const leftPage = spread.querySelector('.left-page');
        const rightPage = spread.querySelector('.right-page');
        return [
            leftPage ? parseInt(leftPage.dataset.page) : null,
            rightPage ? parseInt(rightPage.dataset.page) : null
        ];
    }

    toggleFullscreen() {
        if (this.isFullscreen) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }

    enterFullscreen() {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
        this.albumContainer.classList.add('fullscreen');
        this.isFullscreen = true;
        this.fullscreenBtn.innerHTML = '<span>⛶</span><span class="btn-text">Sortir</span>';
    }

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        this.albumContainer.classList.remove('fullscreen');
        this.isFullscreen = false;
        this.fullscreenBtn.innerHTML = '<span>⛶</span><span class="btn-text">Plein écran</span>';
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.albumBook = new AlbumBook();
});

document.addEventListener('fullscreenchange', () => {
    if (window.albumBook && !document.fullscreenElement) {
        window.albumBook.exitFullscreen();
    }
});

document.addEventListener('webkitfullscreenchange', () => {
    if (window.albumBook && !document.webkitFullscreenElement) {
        window.albumBook.exitFullscreen();
    }
});

// Amélioration de l'accessibilité
document.addEventListener('keydown', (e) => {
    // Permettre la navigation avec Tab
    if (e.key === 'Tab') {
        return;
    }
    
    // Empêcher le défilement de la page avec les flèches
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
    }
});

// Optimisation des performances
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculer les dimensions si nécessaire
        const album = document.querySelector('.album');
        if (album) {
            album.style.height = '';
            album.offsetHeight; // Force reflow
        }
    }, 100);
}); 