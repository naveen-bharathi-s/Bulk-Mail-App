const fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', (event) => {
    const file =event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
        console.log(emailList);
    };
    reader.readAsBinaryString(file);
});     