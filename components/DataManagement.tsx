import React, { useRef } from 'react';

const LOCAL_STORAGE_KEYS = [
    'homeworkItems',
    'achievements',
    'homeworkStats',
    'focusStats',
    'lastMoodEntry'
];

const DataManagement: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        try {
            const data: { [key: string]: any } = {};
            LOCAL_STORAGE_KEYS.forEach(key => {
                const item = localStorage.getItem(key);
                if (item) {
                    data[key] = JSON.parse(item);
                }
            });

            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `vibe-tutor-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('Data exported successfully!');
        } catch (error) {
            console.error('Failed to export data:', error);
            alert('An error occurred during export.');
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("Invalid file format");

                const data = JSON.parse(text);
                const confirmed = window.confirm(
                    'Are you sure you want to import this data? This will overwrite all current progress.'
                );

                if (confirmed) {
                    Object.keys(data).forEach(key => {
                        if (LOCAL_STORAGE_KEYS.includes(key)) {
                            localStorage.setItem(key, JSON.stringify(data[key]));
                        }
                    });
                    alert('Data imported successfully! The app will now reload.');
                    window.location.reload();
                }
            } catch (error) {
                console.error('Failed to import data:', error);
                alert('Failed to import data. Please ensure it is a valid backup file.');
            } finally {
                // Reset file input
                if(fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.readAsText(file);
    };

    const handleReset = () => {
        const confirmed = window.confirm(
            'Are you sure you want to reset all app data? This action cannot be undone.'
        );
        if (confirmed) {
            LOCAL_STORAGE_KEYS.forEach(key => {
                localStorage.removeItem(key);
            });
            alert('Application data has been reset. The app will now reload.');
            window.location.reload();
        }
    };

  return (
    <div className="p-6 bg-background-surface border border-[var(--border-color)] rounded-2xl">
      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-accent)] to-[var(--secondary-accent)] mb-4">Data Management</h3>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={handleExport} className="px-5 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Export Data
            </button>
            <button onClick={handleImportClick} className="px-5 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                Import Data
            </button>
            <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <button onClick={handleReset} className="px-5 py-3 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                Reset App
            </button>
       </div>
    </div>
  );
};

export default DataManagement;