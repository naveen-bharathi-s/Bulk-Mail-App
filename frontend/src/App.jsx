// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import axios from "axios";
// import * as XLSX from 'xlsx';

// function App() {
//   const [msg, setMsg] = useState("");
//   const [tree, settree] = useState(false);
//   const [emailList,setemailList]=useState([])

//   const handlefile = (event) => {
//     const file =event.target.files[0];
//     console.log(file);
//     const reader = new FileReader();
//     reader.onload = (e) => {
//         const data = e.target.result;
//         const workbook = XLSX.read(data, { type: 'binary' });
//         const firstSheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[firstSheetName];
//         const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
//         const totalemail = emailList.map((item)=>{ return item.A})
//         setemailList(totalemail)
//         console.log(totalemail);
//     };
//     reader.readAsBinaryString(file);
//   }

//   const handletext = (e) => {
//     setMsg(e.target.value);
//   };

//   const handlesend = () => {
//     settree(true);

//     axios
//       .post("http://localhost:8000/SendMail", { msg: msg, emailList:emailList })
//       .then((res) => {
//         alert(res.data);
//         setMsg("");
//       })
//       .catch((err) => {
//         console.log(err);
//       })
//       .finally(() => {
//         settree(false);
//       });
//   };

//   return (
//     <div>
//       <div className="bg-blue-950  text-white p-8 text-center">
//         <h1 className=" font-bold text-2xl">Bulk Mail</h1>
//       </div>

//       <div className="bg-blue-800 text-white p-8 text-center">
//         <h1 className=" font-bold text-xl">
//           We can help your business with sending multiple emails at once
//         </h1>
//       </div>

//       <div className="bg-blue-600 text-white p-8 text-center">
//         <h1 className=" font-bold ">Drag and drop your excel file</h1>
//       </div>

//       <div className="bg-blue-400 flex flex-col items-center p-8 text-center">
//         <textarea
//           className="w-[80%] h-32 p-2 border border-black rounded"
//           placeholder="Enter the email text..."
//           value={msg}
//           onChange={handletext}
//         ></textarea>

//         <div>
//           <input type="file" onChange={handlefile} className="border border-dashed py-4 px-2 my-5" />
//         </div>

//         <p>Total Email in the file: {emailList.length}</p>
//         <button
//           className="bg-blue-950 text-white px-4 py-2 rounde my-2"
//           onClick={handlesend}
//         >
//           {tree === false ? "Send Mail" : "Sending..."}
//         </button>
//       </div>

//       <div className="bg-blue-300 text-white p-12 text-center">
//         <h1 className=" font-bold text-xl"> </h1>
//       </div>

//       <div className="bg-blue-200 text-white p-12 text-center">
//         <h1 className=" font-bold "></h1>
//       </div>
//     </div>
//   );
// }

// export default App;


// import { useState, useEffect } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";

// function App() {
//   const [msg, setMsg] = useState("");
//   const [subject, setSubject] = useState("");
//   const [sending, setSending] = useState(false);
//   const [emailList, setEmailList] = useState([]);
//   const [history, setHistory] = useState([]);

//   const handleFile = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const workbook = XLSX.read(e.target.result, { type: "binary" });
//       const firstSheet = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[firstSheet];
//       const list = XLSX.utils.sheet_to_json(worksheet, { header: "A" })
//                    .map(item => item.A);
//       setEmailList(list);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const sendMail = () => {
//     if (!subject || !msg || emailList.length === 0) {
//       alert("Enter subject, message and upload emails.");
//       return;
//     }
//     setSending(true);
//     axios.post("http://localhost:8000/SendMail", { subject, msg, emailList })
//       .then(res => {
//         alert(`Sent: ${res.data.sent}, Failed: ${res.data.failed.length}`);
//         setMsg("");
//         setSubject("");
//         fetchHistory();
//       })
//       .catch(err => {
//         console.error(err);
//         alert("Error sending emails");
//       })
//       .finally(() => setSending(false));
//   };

//   const fetchHistory = () => {
//     axios.get("http://localhost:8000/history")
//       .then(res => setHistory(res.data))
//       .catch(console.error);
//   };

//   useEffect(fetchHistory, []);

//   return (
//     <div>
//       <header className="bg-blue-950 text-white p-6 text-center text-2xl font-bold">Bulk Mail</header>

//       <div className="p-6 text-center">
//         <input
//           type="text"
//           className="border p-2 w-3/4 my-2"
//           placeholder="Email Subject"
//           value={subject}
//           onChange={(e) => setSubject(e.target.value)}
//         />

//         <textarea
//           className="border p-2 w-3/4 h-32 my-2"
//           placeholder="Email Message"
//           value={msg}
//           onChange={(e) => setMsg(e.target.value)}
//         />

//         <input type="file" onChange={handleFile} className="my-4" />
//         <p>Total Emails: {emailList.length}</p>

//         <button
//           onClick={sendMail}
//           disabled={sending}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           {sending ? "Sending..." : "Send Mail"}
//         </button>
//       </div>

//       {/* History Table */}
//       <div className="p-6">
//         <h2 className="text-xl font-bold mb-2">Send History</h2>
//         <table className="table-auto w-full text-left border">
//           <thead>
//             <tr>
//               <th className="border px-2">Date</th>
//               <th className="border px-2">Subject</th>
//               <th className="border px-2">Sent</th>
//               <th className="border px-2">Failed</th>
//             </tr>
//           </thead>
//           <tbody>
//             {history.map(h => (
//               <tr key={h._id}>
//                 <td className="border px-2">{new Date(h.createdAt).toLocaleString()}</td>
//                 <td className="border px-2">{h.subject}</td>
//                 <td className="border px-2">{h.sentCount}</td>
//                 <td className="border px-2">{h.failed.length}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default App;






// import { useState, useEffect } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";

// export default function App() {
//   const [msg, setMsg] = useState("");
//   const [subject, setSubject] = useState("");
//   const [sending, setSending] = useState(false);
//   const [emailList, setEmailList] = useState([]);
//   const [history, setHistory] = useState([]);

//   const handleFile = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       const workbook = XLSX.read(ev.target.result, { type: "binary" });
//       const sheet = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheet];
//       const list = XLSX.utils.sheet_to_json(worksheet, { header: "A" })
//                    .map((i) => i.A);
//       setEmailList(list);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const sendMail = () => {
//     if (!subject || !msg || !emailList.length) {
//       alert("Please fill subject, message and upload an email list.");
//       return;
//     }
//     setSending(true);
//     axios.post("http://localhost:8000/SendMail", { subject, msg, emailList })
//       .then(res => {
//         alert(`Sent: ${res.data.sent}, Failed: ${res.data.failed.length}`);
//         setSubject("");
//         setMsg("");
//         fetchHistory();
//       })
//       .catch(() => alert("Error sending mail"))
//       .finally(() => setSending(false));
//   };

//   const fetchHistory = () => {
//     axios.get("http://localhost:8000/history")
//       .then(res => setHistory(res.data))
//       .catch(console.error);
//   };

//   useEffect(fetchHistory, []);

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-800">
//       <header className="bg-indigo-700 text-white py-6 text-center shadow-md">
//         <h1 className="text-3xl font-bold">Bulk Mail Sender</h1>
//         <p className="text-sm mt-1">Send emails to multiple recipients in one go</p>
//       </header>

//       <main className="max-w-3xl mx-auto p-6">
//         <section className="bg-white shadow rounded-lg p-6 mb-8">
//           <h2 className="text-xl font-semibold mb-4">Compose Email</h2>
//           <input
//             type="text"
//             placeholder="Subject"
//             value={subject}
//             onChange={(e) => setSubject(e.target.value)}
//             className="w-full mb-4 p-2 border border-gray-300 rounded"
//           />
//           <textarea
//             placeholder="Message"
//             value={msg}
//             onChange={(e) => setMsg(e.target.value)}
//             className="w-full h-32 mb-4 p-2 border border-gray-300 rounded"
//           />
//           <input
//             type="file"
//             onChange={handleFile}
//             className="block mb-4 text-sm"
//           />
//           <p className="mb-4 text-gray-600">Total Emails: {emailList.length}</p>
//           <button
//             onClick={sendMail}
//             disabled={sending}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded disabled:opacity-50"
//           >
//             {sending ? "Sending..." : "Send Mail"}
//           </button>
//         </section>

//         <section className="bg-white shadow rounded-lg p-6">
//           <h2 className="text-xl font-semibold mb-4">Send History</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full border text-sm">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="border px-3 py-2">Date</th>
//                   <th className="border px-3 py-2">Subject</th>
//                   <th className="border px-3 py-2">Sent</th>
//                   <th className="border px-3 py-2">Failed</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {history.map((h) => (
//                   <tr key={h._id} className="odd:bg-gray-50">
//                     <td className="border px-3 py-2">
//                       {new Date(h.createdAt).toLocaleString()}
//                     </td>
//                     <td className="border px-3 py-2">{h.subject}</td>
//                     <td className="border px-3 py-2 text-green-700">
//                       {h.sentCount}
//                     </td>
//                     <td className="border px-3 py-2 text-red-600">
//                       {h.failed.length}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }







import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function App() {
  const [msg, setMsg] = useState("");
  const [subject, setSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [emailList, setEmailList] = useState([]);
  const [history, setHistory] = useState([]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      const workbook = XLSX.read(ev.target.result, { type: "binary" });
      const sheet = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheet];
      const list = XLSX.utils.sheet_to_json(worksheet, { header: "A" })
                   .map((i) => i.A);
      setEmailList(list);
    };
    reader.readAsBinaryString(file);
  };

  const fetchHistory = () => {
    axios.get("http://localhost:8000/history")
      .then(res => setHistory(res.data))
      .catch(console.error);
  };

  const sendMail = () => {
    if (!subject || !msg || !emailList.length) {
      alert("Please fill subject, message and upload an email list.");
      return;
    }
    setSending(true);
    axios.post("http://localhost:8000/SendMail", { subject, msg, emailList })
      .then(res => {
        alert(`Sent: ${res.data.sent}, Failed: ${res.data.failed.length}`);
        setSubject("");
        setMsg("");
        fetchHistory();
      })
      .catch(() => alert("Error sending mail"))
      .finally(() => setSending(false));
  };

  // 🔴 NEW: delete a history record
  const deleteRecord = (id) => {
    if (!window.confirm("Delete this record?")) return;
    axios.delete(`http://localhost:8000/history/${id}`)
      .then(() => setHistory(history.filter(h => h._id !== id)))
      .catch(() => alert("Failed to delete record"));
  };

  useEffect(fetchHistory, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-indigo-700 text-white py-6 text-center shadow-md">
        <h1 className="text-3xl font-bold">Bulk Mail Sender</h1>
        <p className="text-sm mt-1">Send emails to multiple recipients in one go</p>
      </header>

      

      <main className="max-w-4xl mx-auto p-6">

        <section className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Compose Email</h2>
           <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded"
          />
          <textarea
            placeholder="Message"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="w-full h-32 mb-4 p-2 border border-gray-300 rounded"
          />
          <input
            type="file"
            onChange={handleFile}
            className="block mb-4 text-sm"
          />
          <p className="mb-4 text-gray-600">Total Emails: {emailList.length}</p>
          <button
            onClick={sendMail}
            disabled={sending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send Mail"}
          </button>
        </section>
        
        {/* Compose Section */}
        {/* History Section */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Send History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">Date</th>
                  <th className="border px-3 py-2">Subject</th>
                  <th className="border px-3 py-2">Sent</th>
                  <th className="border px-3 py-2">Failed</th>
                  <th className="border px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h._id} className="odd:bg-gray-50">
                    <td className="border px-3 py-2">
                      {new Date(h.createdAt).toLocaleString()}
                    </td>
                    <td className="border px-3 py-2">{h.subject}</td>
                    <td className="border px-3 py-2 text-green-700">
                      {h.sentCount}
                    </td>
                    <td className="border px-3 py-2 text-red-600">
                      {h.failed.length}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <button
                        onClick={() => deleteRecord(h._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
