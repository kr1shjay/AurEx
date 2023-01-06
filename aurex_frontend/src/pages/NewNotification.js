import React, { useState, useEffect } from 'react';

const NewNotification = () =>{
    return(<>
       <div className='newnotify'>
          <ul className='pl-0'>
            <li className='unread'>
                <div className='d-flex align-items-center pl-sm-2'>
                    <span className='stat mr-2 shrink-0'></span>
                    <div className='mr-sm-4'>
                        <p className='f-12 lighttxt'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ea necessitatibus explicabo exercitationem atque nisi placeat laboriosam! Aspernatur deserunt ipsam omnis iste ab modi magni, ducimus inventore placeat id illum!</p>
                        <p className='text-muted f-12'>25/11/2022</p>
                    </div>
                    <button className='btn btn-link ml-auto text-capital f-12 py-0 pr-2 shrink-0 pl-2 d-sm-block d-none'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M374.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 178.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l160-160zm96 128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7 86.6 297.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l256-256z"/></svg> 
                    Mark as read</button>
                </div>
            </li>
            <li className='read'>
                <div className='d-flex align-items-center pl-sm-2'>
                    <span className='stat mr-2 shrink-0'></span>
                    <div>
                        <p className='f-12 lighttxt'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ea necessitatibus explicabo exercitationem atque nisi placeat laboriosam! Aspernatur deserunt ipsam omnis iste ab modi magni, ducimus inventore placeat id illum!</p>
                        <p className='text-muted f-12'>25/11/2022</p>
                    </div>
                    <button className='btn btn-link ml-auto text-capital f-12 py-0 pr-2 shrink-0 pl-2 d-sm-block d-none'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M374.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 178.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l160-160zm96 128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7 86.6 297.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l256-256z"/></svg>
                    Mark as read</button>
                </div>
            </li>
            <li className='read'>
                <div className='d-flex align-items-center pl-sm-2'>
                    <span className='stat mr-2 shrink-0'></span>
                    <div>
                        <p className='f-12 lighttxt'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ea necessitatibus explicabo exercitationem atque nisi placeat laboriosam! Aspernatur deserunt ipsam omnis iste ab modi magni, ducimus inventore placeat id illum!</p>
                        <p className='text-muted f-12'>25/11/2022</p>
                    </div>
                    <button className='btn btn-link ml-auto text-capital f-12 py-0 pr-2 shrink-0 pl-2 d-sm-block d-none'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M374.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 178.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l160-160zm96 128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7 86.6 297.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l256-256z"/></svg>
                    Mark as read</button>
                </div>
            </li>
          </ul>
       </div>
    </>)
}

export default NewNotification