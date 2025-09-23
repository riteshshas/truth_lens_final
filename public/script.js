document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const textTab = document.getElementById('textTab');
    const imageTab = document.getElementById('imageTab');
    const textMode = document.getElementById('textMode');
    const imageMode = document.getElementById('imageMode');
    const textInputEl = document.getElementById('textInput');
    const imageInput = document.getElementById('imageInput');
    const dropZone = document.getElementById('dropZone');
    const dropContent = document.getElementById('dropContent');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const fileName = document.getElementById('fileName');
    const textResult = document.getElementById('textResult');
    const imageResult = document.getElementById('imageResult');
    const checkTextBtn = document.getElementById('checkTextBtn');
    const checkImageBtn = document.getElementById('checkImageBtn');
    const exampleTextBtn = document.getElementById('exampleTextBtn');
    const exampleImageBtn = document.getElementById('exampleImageBtn');
    const startVerifyingBtn = document.getElementById('startVerifyingBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');

    let loading = false;

    // Helper function for loading state
    function setLoading(isLoading, type) {
        loading = isLoading;
        const btn = type === 'text' ? checkTextBtn : checkImageBtn;
        const btnText = type === 'text' ? document.getElementById('textBtnText') : document.getElementById('imageBtnText');
        const spinner = type === 'text' ? document.getElementById('textSpinner') : document.getElementById('imageSpinner');

        if (isLoading) {
            btnText.classList.add('hidden');
            spinner.classList.remove('hidden');
            btn.disabled = true;
            btn.classList.add('opacity-75', 'cursor-not-allowed');
        } else {
            btnText.classList.remove('hidden');
            spinner.classList.add('hidden');
            btn.disabled = false;
            btn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    }

    // Function to handle text verification
    async function handleCheckText() {
        if (loading) return;
        const text = textInputEl.value.trim();
        if (!text) {
            alert('Please enter some text to analyze!');
            return;
        }

        setLoading(true, 'text');
        textResult.innerHTML = '<div class="text-center text-gray-500 py-8"><div class="spinner mx-auto"></div><p class="mt-2">Analyzing text...</p></div>';

        try {
            const response = await fetch('/api/verify-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            const data = await response.json();

            if (response.ok) {
                textResult.innerHTML = `
                    <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <span class="text-blue-500 mr-2">📊</span> Gemini Analysis Report
                        </h4>
                        <div class="space-y-3">
                            <p class="text-gray-700 text-sm leading-relaxed">${data.result}</p>
                        </div>
                    </div>
                `;
            } else {
                textResult.innerHTML = `
                    <div class="bg-red-50 border border-red-200 rounded-xl p-4">
                        <h4 class="text-red-800 font-bold mb-2">❌ Error</h4>
                        <p class="text-red-700">${data.error || 'An error occurred during analysis.'}</p>
                    </div>
                `;
            }
        } catch (error) {
            textResult.innerHTML = `
                <div class="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h4 class="text-red-800 font-bold mb-2">❌ Network Error</h4>
                    <p class="text-red-700">Failed to connect to the server. Please try again later.</p>
                </div>
            `;
            console.error('Fetch error:', error);
        } finally {
            setLoading(false, 'text');
        }
    }

    // Function to handle image verification
    async function handleCheckImage() {
        if (loading) return;
        const imageFile = document.getElementById('imageInput').files[0];
        
        if (!imageFile) {
            alert('Please select an image to analyze!');
            return;
        }

        setLoading(true, 'image');
        imageResult.innerHTML = '<div class="text-center text-gray-500 py-8"><div class="spinner mx-auto"></div><p class="mt-2">Uploading image...</p></div>';

        try {
            // Step 1: Upload the image file to the backend
            const formData = new FormData();
            formData.append('image', imageFile);

            const uploadResponse = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData
            });
            const uploadData = await uploadResponse.json();

            if (!uploadResponse.ok) {
                throw new Error(uploadData.error || 'Failed to upload image.');
            }

            const imageUrl = uploadData.imageUrl;

            // Step 2: Use the returned URL to verify the image with SerpAI
            imageResult.innerHTML = '<div class="text-center text-gray-500 py-8"><div class="spinner mx-auto"></div><p class="mt-2">Analyzing image...</p></div>';

            const verificationResponse = await fetch('/api/verify-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl })
            });

            const verificationData = await verificationResponse.json();

            if (verificationResponse.ok) {
                imageResult.innerHTML = `
                    <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <span class="text-green-500 mr-2">✅</span> Image Analysis Report
                        </h4>
                        <pre class="bg-gray-100 p-4 rounded-md text-sm whitespace-pre-wrap">${JSON.stringify(verificationData.result.visual_matches, null, 2)}</pre>
                        <div class="mt-4">
                            <p class="text-gray-700 font-semibold">Verification Score: ${verificationData.result.visual_matches.length > 0 ? "Found on " + verificationData.result.visual_matches.length + " sites" : "Not found online"}</p>
                        </div>
                    </div>
                `;
            } else {
                imageResult.innerHTML = `
                    <div class="bg-red-50 border border-red-200 rounded-xl p-4">
                        <h4 class="text-red-800 font-bold mb-2">❌ Error</h4>
                        <p class="text-red-700">${verificationData.error || 'An error occurred during analysis.'}</p>
                    </div>
                `;
            }
        } catch (error) {
            imageResult.innerHTML = `
                <div class="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h4 class="text-red-800 font-bold mb-2">❌ Error</h4>
                    <p class="text-red-700">${error.message || 'An unexpected error occurred.'}</p>
                </div>
            `;
            console.error('Fetch error:', error);
        } finally {
            setLoading(false, 'image');
        }
    }
    
    // Helper functions for UI
    function switchMode(mode) {
        document.querySelectorAll('.tab-button').forEach(tab => {
            tab.classList.remove('bg-white', 'shadow-sm');
            tab.classList.add('hover:bg-gray-200');
        });
        if (mode === 'text') {
            textTab.classList.add('bg-white', 'shadow-sm');
            textTab.classList.remove('hover:bg-gray-200');
            textMode.classList.remove('hidden');
            imageMode.classList.add('hidden');
        } else {
            imageTab.classList.add('bg-white', 'shadow-sm');
            imageTab.classList.remove('hover:bg-gray-200');
            imageMode.classList.remove('hidden');
            textMode.classList.add('hidden');
        }
    }

    function smoothScrollTo(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const offsetTop = element.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    }

    function useExampleText() {
        textInputEl.value = "Scientists have discovered a new particle at the LHC that could revolutionize energy production and lead to breakthrough technologies in the next decade.";
    }

    // Since SerpAI requires a public URL, we'll use a placeholder for the example
    function useExampleImage() {
        // You can't use a local file for the example, as the API can't access it.
        alert('Please use a real image file for this function.');
    }

    // Event listeners
    textTab.addEventListener('click', () => switchMode('text'));
    imageTab.addEventListener('click', () => switchMode('image'));
    checkTextBtn.addEventListener('click', handleCheckText);
    checkImageBtn.addEventListener('click', handleCheckImage);
    exampleTextBtn.addEventListener('click', useExampleText);
    exampleImageBtn.addEventListener('click', useExampleImage);

    // Navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            smoothScrollTo(this.getAttribute('href').substring(1));
        });
    });
    startVerifyingBtn.addEventListener('click', () => smoothScrollTo('verify'));
    learnMoreBtn.addEventListener('click', () => smoothScrollTo('features'));

    // Handle file uploads
    dropZone.addEventListener('click', () => imageInput.click());
    dropZone.addEventListener('dragover', (e) => { 
        e.preventDefault(); 
        dropZone.classList.add('border-blue-400'); 
    });
    
    dropZone.addEventListener('dragleave', () => { 
        dropZone.classList.remove('border-blue-400'); 
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-blue-400');
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.classList.remove('hidden');
                dropContent.classList.add('hidden');
                previewImg.src = e.target.result;
                fileName.textContent = file.name;
            };
            reader.readAsDataURL(file);
        }
    });

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.classList.remove('hidden');
                dropContent.classList.add('hidden');
                previewImg.src = e.target.result;
                fileName.textContent = file.name;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.classList.add('shadow-lg');
        } else {
            nav.classList.remove('shadow-lg');
        }
    });
});