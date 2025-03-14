document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const outputVariables = document.getElementById('outputVariables');
    const outputDefinitions = document.getElementById('outputDefinitions');
    const outputDefinitions2 = document.getElementById('outputDefinitions2');
    const outputCreation = document.getElementById('outputCreation');
    const processBtn = document.getElementById('processBtn');
    const startAddress = document.getElementById('startAddress');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const importBtn = document.getElementById('importBtn');
    const exportBtn = document.getElementById('exportBtn');
    const projectImport = document.getElementById('projectImport');
    const projectName = document.getElementById('projectName');
    const projectDrawer = document.getElementById('projectDrawer');
    const projectMenuBtn = document.getElementById('projectMenuBtn');
    const drawerClose = document.getElementById('drawerClose');
    const activeProject = document.getElementById('activeProject');
    const toast = document.getElementById('toast');

    // Son kayıt yeri
    let lastSaveHandle = null;

    // Toast gösterme fonksiyonu
    const showToast = (message, duration = 3000) => {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    };

    // Proje kaydetme fonksiyonu
    const saveProject = async (handle = null) => {
        if (!projectName.value.trim()) {
            alert('Lütfen bir proje adı girin!');
            return;
        }

        const projectData = {
            name: projectName.value,
            startAddress: startAddress.value,
            input: inputText.value,
            variables: outputVariables.value,
            definitions: outputDefinitions.value,
            definitions2: outputDefinitions2.value,
            creation: outputCreation.value
        };

        if ('showSaveFilePicker' in window) {
            try {
                if (!handle) {
                    handle = await window.showSaveFilePicker({
                        suggestedName: `${projectData.name}.csvar`,
                        types: [{
                            description: 'CodeSys Variable Project',
                            accept: {
                                'application/json': ['.csvar']
                            }
                        }]
                    });
                }
                
                const writable = await handle.createWritable();
                await writable.write(JSON.stringify(projectData, null, 2));
                await writable.close();
                
                lastSaveHandle = handle;
                showToast('Proje kaydedildi');
                projectDrawer.classList.remove('open');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Kaydetme hatası:', err);
                    alert('Proje kaydedilirken bir hata oluştu!');
                }
            }
        } else {
            // Eski yöntem - doğrudan indirme
            const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${projectData.name}.csvar`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('Proje kaydedildi');
            projectDrawer.classList.remove('open');
        }
    };

    // Kısayol tuşları
    document.addEventListener('keydown', async (e) => {
        // CTRL+S
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            if (lastSaveHandle) {
                await saveProject(lastSaveHandle);
            } else {
                await saveProject();
            }
        }
        // CTRL+ENTER
        else if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            processBtn.click();
        }
    });

    // Drawer açma/kapama işlevleri
    projectMenuBtn.addEventListener('click', () => {
        projectDrawer.classList.add('open');
    });

    drawerClose.addEventListener('click', () => {
        projectDrawer.classList.remove('open');
    });

    // Drawer dışına tıklandığında kapatma
    document.addEventListener('click', (e) => {
        if (!projectDrawer.contains(e.target) && 
            !projectMenuBtn.contains(e.target) && 
            projectDrawer.classList.contains('open')) {
            projectDrawer.classList.remove('open');
        }
    });

    // Proje adını güncelleme fonksiyonu
    const updateProjectInfo = (name) => {
        if (name) {
            activeProject.textContent = `Aktif Proje: ${name}`;
            activeProject.style.display = 'block';
        } else {
            activeProject.textContent = '';
            activeProject.style.display = 'none';
        }
    };

    // Proje adı değiştiğinde güncelle
    projectName.addEventListener('input', (e) => {
        updateProjectInfo(e.target.value);
    });

    // Sekme değiştirme işlevi
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            // Aktif sekme butonunu güncelle
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Aktif içeriği güncelle
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Proje kaydetme butonu
    exportBtn.addEventListener('click', () => saveProject());

    // Proje yükleme butonu tıklama olayı
    importBtn.addEventListener('click', () => {
        projectImport.click();
    });

    // Proje dosyası seçildiğinde
    projectImport.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                if ('showSaveFilePicker' in window) {
                    // Son kayıt yerini güncelle
                    lastSaveHandle = await file.handle;
                }
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const projectData = JSON.parse(e.target.result);
                        projectName.value = projectData.name || '';
                        startAddress.value = projectData.startAddress || '0';
                        inputText.value = projectData.input || '';
                        outputVariables.value = projectData.variables || '';
                        outputDefinitions.value = projectData.definitions || '';
                        outputDefinitions2.value = projectData.definitions2 || '';
                        outputCreation.value = projectData.creation || '';
                        updateProjectInfo(projectData.name);
                        projectDrawer.classList.remove('open');
                    } catch (error) {
                        console.error('Proje yükleme hatası:', error);
                        alert('Proje dosyası yüklenirken bir hata oluştu!');
                    }
                };
                reader.readAsText(file);
            } catch (error) {
                console.error('Dosya erişim hatası:', error);
            }
        }
    });

    // İşleme butonu tıklama olayı
    processBtn.addEventListener('click', () => {
        const lines = inputText.value.split('\n');
        let lastWord = parseInt(startAddress.value) || 0;
        let lastBit = 0;
        const variables = [];

        // Değişkenleri işle
        lines.forEach(line => {
            if (line.trim()) {
                try {
                    const variable = CodeSysVariable.getVariable(line);
                    
                    if (variable instanceof BoolCodeSysVariable) {
                        variable.wordAddress = lastWord;
                        variable.bitNumber = lastBit;
                        lastBit++;
                        if (lastBit > 15) {
                            lastBit = 0;
                            lastWord++;
                        }
                    } else {
                        lastBit = 0;
                        if (variable.codeSysType === CodeSysType.Real || 
                            variable.codeSysType === CodeSysType.Dint) {
                            if (lastWord % 2 === 1) lastWord++;
                            variable.wordAddress = lastWord;
                            lastWord += 2;
                        } else {
                            variable.wordAddress = lastWord;
                            lastWord++;
                        }
                    }
                    variables.push(variable);
                } catch (error) {
                    console.error('Değişken işleme hatası:', error);
                }
            }
        });

        // Çıktıları güncelle
        outputVariables.value = variables
            .map(v => v.getDisplayName())
            .join('\n');

        outputDefinitions.value = variables
            .map(v => `public ${v.getVariableDefinitionString()}`)
            .join('\n');

        outputDefinitions2.value = variables
            .map(v => `public IVariable ${v.name} { get; set; } = ${v.getVariableCreationString2()};`)
            .join('\n');

        outputCreation.value = variables
            .map(v => v.getVariableCreationString())
            .join('\n');
    });
}); 