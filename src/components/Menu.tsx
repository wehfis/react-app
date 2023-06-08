import React from 'react';

const Menu = (): JSX.Element => {
  return (
    <div className="menu">
      <div className="menu_text" id="text1">Tasks</div>
      <div className="menu_text" id="text2">To Do</div>
      <div className="menu_text" id="text3">In Progress</div>
      <div className="menu_text" id="text4">Done</div>
    </div>
  );
};

export default Menu;