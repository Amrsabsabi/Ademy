import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { NavLink, useLocation } from 'react-router-dom';
import { Pencil } from 'lucide-react'; 

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);
  const location = useLocation();
  const isEditCoursePage = location.pathname.startsWith('/educator/edit-course/');
  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
    { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },];
  if (isEditCoursePage) {
    menuItems.push({
      name: 'Edit Course',
      path: location.pathname,
      icon: <Pencil size={20} />,});}
  return isEducator && (
    <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col'>
      {menuItems.map((item) => (
        <NavLink to={item.path} key={item.name} end={item.path === '/educator'}
          className={({ isActive }) => `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3
            ${isActive ? 'bg-indigo-50 border-r-[6px] border-indigo-500/90' : 'hover:bg-gray-100/90'}`}>
          <div className='w-6 h-6 flex items-center justify-center'>
            {typeof item.icon === 'string' ? (
              <img src={item.icon} alt="" className='w-6 h-6' />
            ) : (item.icon)}
          </div>
          <p className='md:block hidden text-center'>{item.name}</p>
        </NavLink>))}
    </div>);
};
export default Sidebar;
