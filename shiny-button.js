/**
 * ShinyButton - Pure HTML/JS version
 * @author Eddie
 * @date 2026-01-04
 * @license MIT
 */

class ShinyButton {
    constructor(options = {}) {
        this.options = {
            roughness: options.roughness || 0.2,
            offset: options.offset || -200,
            text: options.text || 'Button',
            width: options.width || 300,
            height: options.height || 100,
            borderRadius: options.borderRadius || 56,
            ...options
        };

        this.cameraWidth = 600;
        this.cameraHeight = 600;
        this.cameraFacingMode = 'user';

        this.cursorPosition = { x: 0, y: 0 };
        this.buttonFocus = false;
        this.buttonPressed = false;
        this.fingerprints = [];
        this.showBorderRadius = false;

        this.elements = {};
        this.init();
    }

    scale(number, inMin, inMax, outMin, outMax) {
        return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }

    init() {
        this.createDOM();
        this.setupEventListeners();
        this.setupVideoStream();
        this.checkBrowser();
    }

    createDOM() {
        // Create main container
        this.container = document.createElement('div');
        this.container.className = 'shiny-button-container';
        this.container.style.width = `${this.options.width}px`;
        this.container.style.height = `${this.options.height}px`;

        // Create details container (for cursor reflection and fingerprints)
        this.detailsContainer = document.createElement('div');
        this.detailsContainer.className = 'shiny-button-details-container';
        this.elements.detailsContainer = this.detailsContainer;

        // Hacky inner div for cursor clipping
        const hackyCursorDiv = document.createElement('div');
        hackyCursorDiv.className = 'shiny-button-hacky-cursor-inner-div';

        // Cursor reflection
        this.cursorElement = document.createElement('div');
        this.cursorElement.className = 'shiny-button-cursor';
        this.cursorElement.innerHTML = this.getCursorSVG();
        hackyCursorDiv.appendChild(this.cursorElement);
        this.detailsContainer.appendChild(hackyCursorDiv);

        // Surface reflection video
        this.surfaceReflection = document.createElement('video');
        this.surfaceReflection.className = 'shiny-button-surface-reflection';
        this.surfaceReflection.setAttribute('playsinline', 'true');
        this.surfaceReflection.autoplay = true;
        this.surfaceReflection.muted = true;
        this.elements.surfaceReflection = this.surfaceReflection;

        // Main button container
        this.button = document.createElement('div');
        this.button.className = 'shiny-button';

        // Button reflection video
        this.buttonReflection = document.createElement('video');
        this.buttonReflection.className = 'shiny-button-reflection';
        this.buttonReflection.setAttribute('playsinline', 'true');
        this.buttonReflection.autoplay = true;
        this.buttonReflection.muted = true;
        const mappedRoughness = Math.round(this.scale(this.options.roughness, 0, 1, 0, 16));
        this.buttonReflection.style.filter = `blur(${mappedRoughness}px) saturate(0.4) brightness(1.1)`;
        this.elements.buttonReflection = this.buttonReflection;

        // Shadow overlay
        const shadow = document.createElement('div');
        shadow.className = 'shiny-button-shadow';

        // Button text
        const text = document.createElement('div');
        text.className = 'shiny-button-text';
        text.textContent = this.options.text;

        // Assemble button
        this.button.appendChild(this.buttonReflection);
        this.button.appendChild(shadow);
        this.button.appendChild(text);

        // Assemble main container
        this.container.appendChild(this.detailsContainer);
        this.container.appendChild(this.surfaceReflection);
        this.container.appendChild(this.button);

        // Store references
        this.elements.button = this.button;
        this.elements.text = text;
    }

    getCursorSVG() {
        return `
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_3664_1573)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.61891 14.309C6.33491 13.95 5.98991 13.216 5.37591 12.325C5.02791 11.821 4.16491 10.872 3.90791 10.39C3.68491 9.96404 3.70891 9.77304 3.76191 9.42004C3.85591 8.79204 4.49991 8.30304 5.18691 8.36904C5.70591 8.41804 6.14591 8.76104 6.54191 9.08504C6.78091 9.28004 7.07491 9.65904 7.25191 9.87304C7.41491 10.069 7.45491 10.15 7.62891 10.382C7.85891 10.689 7.93091 10.841 7.84291 10.503C7.77191 10.007 7.65591 9.16004 7.48791 8.41104C7.35991 7.84304 7.32891 7.75404 7.20691 7.31804C7.07791 6.85404 7.01191 6.52904 6.89091 6.03704C6.80691 5.68904 6.65591 4.97804 6.61491 4.57804C6.55791 4.03104 6.52791 3.13904 6.87891 2.72904C7.15391 2.40804 7.78491 2.31104 8.17591 2.50904C8.68791 2.76804 8.97891 3.51204 9.11191 3.80904C9.35091 4.34304 9.49891 4.96004 9.62791 5.77004C9.79191 6.80104 10.0939 8.23204 10.1039 8.53304C10.1279 8.16404 10.0359 7.38704 10.0999 7.03304C10.1579 6.71204 10.4279 6.33904 10.7659 6.23804C11.0519 6.15304 11.3869 6.12204 11.6819 6.18304C11.9949 6.24704 12.3249 6.47104 12.4479 6.68204C12.8099 7.30604 12.8169 8.58104 12.8319 8.51304C12.9179 8.13704 12.9029 7.28404 13.1159 6.92904C13.2559 6.69504 13.6129 6.48404 13.8029 6.45004C14.0969 6.39804 14.4579 6.38204 14.7669 6.44204C15.0159 6.49104 15.3529 6.78704 15.4439 6.92904C15.6619 7.27304 15.7859 8.24604 15.8229 8.58704C15.8379 8.72804 15.8969 8.19504 16.1159 7.85104C16.5219 7.21204 17.9589 7.08804 18.0139 8.49004C18.0389 9.14404 18.0339 9.11404 18.0339 9.55404C18.0339 10.071 18.0219 10.382 17.9939 10.756C17.9629 11.156 17.8769 12.06 17.7519 12.498C17.6659 12.799 17.3809 13.476 17.0999 13.882C17.0999 13.882 16.0259 15.132 15.9089 15.695C15.7909 16.257 15.8299 16.261 15.8069 16.66C15.7839 17.058 15.9279 17.582 15.9279 17.582C15.9279 17.582 15.1259 17.686 14.6939 17.617C14.3029 17.554 13.8189 16.776 13.6939 16.538C13.5219 16.21 13.1549 16.273 13.0119 16.515C12.7869 16.898 12.3029 17.585 11.9609 17.628C11.2929 17.712 9.90691 17.659 8.82191 17.648C8.82191 17.648 9.00691 16.637 8.59491 16.29C8.28991 16.031 7.76491 15.506 7.45091 15.23L6.61891 14.309Z" fill="white" stroke="black" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.8538 14.6635V11.2045" stroke="black" strokeWidth="0.75" strokeLinecap="round"/>
                    <path d="M12.8382 14.6752L12.8222 11.2022" stroke="black" strokeWidth="0.75" strokeLinecap="round"/>
                    <path d="M10.8421 11.2338L10.8631 14.6598" stroke="black" strokeWidth="0.75" strokeLinecap="round"/>
                </g>
                <defs>
                    <filter id="filter0_d_3664_1573" x="0.733344" y="0.4" width="21.2" height="22.2" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="1"/>
                        <feGaussianBlur stdDeviation="1.3"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.32 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3664_1573"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3664_1573" result="shape"/>
                    </filter>
                </defs>
            </svg>
        `;
    }

    setupEventListeners() {
        // Mouse enter/leave
        this.container.addEventListener('mouseenter', () => {
            this.buttonFocus = true;
            this.updateCursor();
        });

        this.container.addEventListener('mouseleave', () => {
            this.buttonFocus = false;
            this.updateCursor();
        });

        // Mouse move for cursor tracking
        document.addEventListener('mousemove', (event) => {
            if (!this.detailsContainer) return;
            const rect = this.detailsContainer.getBoundingClientRect();
            if (!rect) return;

            this.cursorPosition = {
                x: event.clientX - rect.x,
                y: event.clientY - rect.y
            };
            this.updateCursor();
        });

        // Mouse down/up for button press and fingerprints
        this.button.addEventListener('mousedown', (event) => {
            this.buttonPressed = true;
            this.updateButtonState();

            // Add fingerprint
            if (this.detailsContainer) {
                const rect = this.detailsContainer.getBoundingClientRect();
                if (rect) {
                    const fingerprint = {
                        x: event.clientX - rect.x,
                        y: event.clientY - rect.y
                    };
                    this.addFingerprint(fingerprint);
                }
            }
        });

        this.button.addEventListener('mouseup', () => {
            this.buttonPressed = false;
            this.updateButtonState();
        });

        this.button.addEventListener('mouseleave', () => {
            this.buttonPressed = false;
            this.updateButtonState();
        });

        // Touch events for mobile
        this.button.addEventListener('touchstart', (event) => {
            this.buttonPressed = true;
            this.updateButtonState();

            if (event.touches.length > 0 && this.detailsContainer) {
                const rect = this.detailsContainer.getBoundingClientRect();
                if (rect) {
                    const fingerprint = {
                        x: event.touches[0].clientX - rect.x,
                        y: event.touches[0].clientY - rect.y
                    };
                    this.addFingerprint(fingerprint);
                }
            }
        });

        this.button.addEventListener('touchend', () => {
            this.buttonPressed = false;
            this.updateButtonState();
        });
    }

    setupVideoStream() {
        if (!this.buttonReflection || !this.surfaceReflection) return;

        try {
            const constraints = {
                video: {
                    width: { ideal: this.cameraWidth },
                    height: { ideal: this.cameraHeight },
                    facingMode: this.cameraFacingMode
                },
                audio: false
            };

            navigator.mediaDevices.getUserMedia(constraints)
                .then((stream) => {
                    this.buttonReflection.srcObject = stream;
                    this.surfaceReflection.srcObject = stream;
                })
                .catch((error) => {
                    console.error('Error accessing camera:', error);
                    // Fallback: use a static gradient or image
                    this.useFallbackReflection();
                });
        } catch (error) {
            console.error('Error setting up video stream:', error);
            this.useFallbackReflection();
        }
    }

    useFallbackReflection() {
        // Create a gradient fallback for when camera is not available
        const canvas = document.createElement('canvas');
        canvas.width = this.options.width;
        canvas.height = this.options.height;
        const ctx = canvas.getContext('2d');

        // Create a gradient that mimics a reflection
        const gradient = ctx.createLinearGradient(0, 0, this.options.width, this.options.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(0.5, 'rgba(200, 200, 200, 0.1)');
        gradient.addColorStop(1, 'rgba(150, 150, 150, 0.3)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.options.width, this.options.height);

        // Apply blur filter
        ctx.filter = `blur(${Math.round(this.scale(this.options.roughness, 0, 1, 0, 16))}px) saturate(0.4) brightness(1.1)`;

        const dataUrl = canvas.toDataURL();
        this.buttonReflection.style.backgroundImage = `url(${dataUrl})`;
        this.buttonReflection.style.backgroundSize = 'cover';
        this.buttonReflection.style.display = 'none'; // Hide video element

        // Also update surface reflection
        this.surfaceReflection.style.backgroundImage = `url(${dataUrl})`;
        this.surfaceReflection.style.backgroundSize = 'cover';
        this.surfaceReflection.style.display = 'none';
    }

    checkBrowser() {
        // Chrome workaround for border-radius issue
        if (!navigator.userAgent.includes('Chrome')) {
            this.showBorderRadius = true;
            this.detailsContainer.style.borderRadius = `${this.options.borderRadius}px`;
        }
    }

    updateCursor() {
        if (!this.cursorElement) return;

        this.cursorElement.style.transform = `translate(${this.cursorPosition.x}px, ${this.cursorPosition.y}px) translate(-50%, -50%)`;
        this.cursorElement.style.opacity = this.buttonFocus ? '1' : '0';
    }

    updateButtonState() {
        // Update container pressed state
        if (this.buttonPressed) {
            this.container.classList.add('pressed');
            this.button.classList.add('pressed');
            this.surfaceReflection.classList.add('pressed');
        } else {
            this.container.classList.remove('pressed');
            this.button.classList.remove('pressed');
            this.surfaceReflection.classList.remove('pressed');
        }
    }

    addFingerprint(position) {
        const fingerprint = document.createElement('div');
        fingerprint.className = 'shiny-button-fingerprint';
        fingerprint.style.transform = `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`;

        this.detailsContainer.appendChild(fingerprint);
        this.fingerprints.push(fingerprint);

        // Limit number of fingerprints to prevent performance issues
        if (this.fingerprints.length > 20) {
            const oldFingerprint = this.fingerprints.shift();
            if (oldFingerprint && oldFingerprint.parentNode) {
                oldFingerprint.parentNode.removeChild(oldFingerprint);
            }
        }
    }

    setText(text) {
        if (this.elements.text) {
            this.elements.text.textContent = text;
        }
    }

    setRoughness(roughness) {
        this.options.roughness = roughness;
        const mappedRoughness = Math.round(this.scale(roughness, 0, 1, 0, 16));
        if (this.buttonReflection) {
            this.buttonReflection.style.filter = `blur(${mappedRoughness}px) saturate(0.4) brightness(1.1)`;
        }
    }

    getElement() {
        return this.container;
    }

    destroy() {
        // Stop video streams
        if (this.buttonReflection && this.buttonReflection.srcObject) {
            const tracks = this.buttonReflection.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }

        // Remove event listeners
        this.container.remove();
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.ShinyButton = ShinyButton;
}