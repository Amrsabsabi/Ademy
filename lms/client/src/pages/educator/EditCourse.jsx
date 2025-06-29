// import React, { useContext, useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import uniqid from 'uniqid';
// import axios from 'axios';
// import { AppContext } from '../../context/AppContext';
// import { toast } from 'react-toastify';
// import { assets } from '../../assets/assets';

// const EditCourse = () => {
//   const { id } = useParams();
//   const { backendUrl, getToken } = useContext(AppContext);
//   const [courseData, setCourseData] = useState(null);
//   const [price, setPrice] = useState(0);
//   const [discount, setDiscount] = useState(0);
//   const [chapters, setChapters] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [currentChapterId, setCurrentChapterId] = useState(null);
//   const [lectureDetails, setLectureDetails] = useState({
//     lectureTitle: '',
//     lectureDuration: '',
//     lectureUrl: '',
//     isPreviewFree: false,
//   });

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const { data } = await axios.get(`${backendUrl}/api/course/${id}`);
//         if (data.success) {
//           setCourseData(data.courseData);
//           setPrice(data.courseData.coursePrice);
//           setDiscount(data.courseData.discount);
//           setChapters(data.courseData.courseContent);
//         }
//       } catch (err) {
//         toast.error("Failed to load course.");
//       }
//     };
//     fetchCourse();
//   }, [backendUrl, id]);

//   const handleChapter = (action, chapterId) => {
//     if (action === 'add') {
//       const title = prompt('Enter Chapter Name:');
//       if (title) {
//         const newChapter = {
//           chapterId: uniqid(),
//           chapterTitle: title,
//           chapterContent: [],
//           collapsed: false,
//           chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
//         };
//         setChapters([...chapters, newChapter]);
//       }
//     } else if (action === 'remove') {
//       setChapters(chapters.filter(ch => ch.chapterId !== chapterId));
//     } else if (action === 'toggle') {
//       setChapters(chapters.map(ch =>
//         ch.chapterId === chapterId ? { ...ch, collapsed: !ch.collapsed } : ch
//       ));
//     }
//   };

//   const handleLecture = (action, chapterId, lectureIndex) => {
//     if (action === 'add') {
//       setCurrentChapterId(chapterId);
//       setShowPopup(true);
//     } else if (action === 'remove') {
//       setChapters(
//         chapters.map(ch => {
//           if (ch.chapterId === chapterId) {
//             ch.chapterContent.splice(lectureIndex, 1);
//           }
//           return ch;
//         })
//       );
//     }
//   };

//   const addLecture = () => {
//     setChapters(
//       chapters.map(ch => {
//         if (ch.chapterId === currentChapterId) {
//           const newLecture = {
//             ...lectureDetails,
//             lectureOrder: ch.chapterContent.length > 0 ? ch.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
//             lectureId: uniqid()
//           };
//           ch.chapterContent.push(newLecture);
//         }
//         return ch;
//       })
//     );
//     setShowPopup(false);
//     setLectureDetails({
//       lectureTitle: '',
//       lectureDuration: '',
//       lectureUrl: '',
//       isPreviewFree: false,
//     });
//   };

//   const handleSave = async () => {
//     if (!courseData) {
//       toast.error("Course data is not loaded yet");
//       return;
//     }
//     try {
//       const updatedCourse = {
//         ...courseData,              // كل بيانات الكورس الأصلية بدون تغيير
//         coursePrice: Number(price), // فقط تعديل السعر
//         discount: Number(discount), // فقط تعديل الخصم
//         courseContent: chapters    // تعديل الفصول والمحتوى
//       };

//       const token = await getToken();
//       const { data } = await axios.put(`${backendUrl}/api/course/${id}`, updatedCourse,{ headers: { Authorization: `Bearer ${token}` } });

//       if (data.success) {
//         toast.success("Course updated successfully");
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error("Update failed");
//     }
//   };

//   if (!courseData) return <div className='p-4'>Loading...</div>;

//   return (
//     <div className='p-4 max-w-3xl mx-auto'>
//       <h2 className='text-xl font-bold mb-4'>Edit Course</h2>

//       <div className='flex gap-4 mb-4'>
//         <div>
//           <p>Price</p>
//           <input
//             type='number'
//             value={price}
//             onChange={e => setPrice(e.target.value)}
//             className='border rounded px-2 py-1'
//           />
//         </div>
//         <div>
//           <p>Discount %</p>
//           <input
//             type='number'
//             value={discount}
//             onChange={e => setDiscount(e.target.value)}
//             className='border rounded px-2 py-1'
//           />
//         </div>
//       </div>

//       <div>
//         {chapters.map((chapter, chapterIndex) => (
//           <div className='bg-white border rounded-lg mb-4' key={chapter.chapterId}>
//             <div className='flex justify-between items-center p-4 border-b'>
//               <div className='flex items-center'>
//                 <img
//                   onClick={() => handleChapter('toggle', chapter.chapterId)}
//                   src={assets.dropdown_icon}
//                   width={14}
//                   alt=""
//                   className={`mr-2 cursor-pointer transition-all ${chapter.collapsed && "-rotate-90"}`}
//                 />
//                 <span className='font-semibold'>{chapterIndex + 1}. {chapter.chapterTitle}</span>
//               </div>
//               <img
//                 src={assets.cross_icon}
//                 alt=""
//                 className='cursor-pointer'
//                 onClick={() => handleChapter('remove', chapter.chapterId)}
//               />
//             </div>
//             {!chapter.collapsed && (
//               <div className='p-4'>
//                 {chapter.chapterContent.map((lecture, lectureIndex) => (
//                   <div key={lecture.lectureId} className='flex justify-between items-center mb-2'>
//                     <span>
//                       {lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins -{' '}
//                       <a href={lecture.lectureUrl} target='_blank' rel='noreferrer' className='text-blue-500'>Link</a> -{' '}
//                       {lecture.isPreviewFree ? 'Free' : 'Paid'}
//                     </span>
//                     <img
//                       src={assets.cross_icon}
//                       alt=""
//                       className='cursor-pointer'
//                       onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)}
//                     />
//                   </div>
//                 ))}
//                 <div
//                   className='bg-gray-100 p-2 rounded cursor-pointer mt-2 w-max'
//                   onClick={() => handleLecture('add', chapter.chapterId)}
//                 >
//                   + Add Lecture
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//         <div
//           className='bg-blue-100 p-2 rounded-lg cursor-pointer w-max'
//           onClick={() => handleChapter('add')}
//         >
//           + Add Chapter
//         </div>
//       </div>

//       <button
//         className='mt-6 bg-black text-white py-2 px-6 rounded'
//         onClick={handleSave}
//       >
//         Save Changes
//       </button>

//       {showPopup && (
//         <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
//           <div className='bg-white text-gray-700 p-4 rounded relative w-full max-w-80'>
//             <h2 className='text-lg font-semibold mb-4'>Add Lecture</h2>
//             <div className='mb-2'>
//               <p>Lecture Title</p>
//               <input
//                 type="text"
//                 className='mt-1 block w-full border rounded py-1 px-2'
//                 value={lectureDetails.lectureTitle}
//                 onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
//               />
//             </div>
//             <div className='mb-2'>
//               <p>Duration (minutes)</p>
//               <input
//                 type="number"
//                 className='mt-1 block w-full border rounded py-1 px-2'
//                 value={lectureDetails.lectureDuration}
//                 onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
//               />
//             </div>
//             <div className='mb-2'>
//               <p>Lecture URL</p>
//               <input
//                 type="text"
//                 className='mt-1 block w-full border rounded py-1 px-2'
//                 value={lectureDetails.lectureUrl}
//                 onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
//               />
//             </div>
//             <div className='flex gap-2 my-4'>
//               <p>Is Preview Free?</p>
//               <input
//                 type="checkbox"
//                 className='mt-1 scale-125'
//                 checked={lectureDetails.isPreviewFree}
//                 onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
//               />
//             </div>
//             <button
//               onClick={addLecture}
//               type='button'
//               className='w-full bg-blue-400 text-white px-4 py-2 rounded'
//             >
//               Add
//             </button>
//             <img
//               src={assets.cross_icon}
//               alt=""
//               onClick={() => setShowPopup(false)}
//               className='absolute top-4 right-4 w-4 cursor-pointer'
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EditCourse;




