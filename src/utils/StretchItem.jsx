import { Draggable } from 'react-beautiful-dnd'
import stretchAnimations from './stretchAnimations'

const StretchItem = ({ stretch, index, currentStretch, onClick }) => {
    const isActive = currentStretch && currentStretch.id === stretch.id;
  
    // Handle click without interfering with drag
    const handleClick = (e, stretch) => {
      // Only trigger click if it's not part of a drag operation
      if (!e.defaultPrevented) {
        onClick(stretch);
      }
    };
  
    return (
      <Draggable draggableId={stretch.id.toString()} index={index}>
        {(provided, snapshot) => (
          <div
            className={`stretch-item ${isActive ? 'active' : ''} ${stretch.completed ? 'completed' : ''} ${snapshot.isDragging ? 'dragging' : ''}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={(e) => handleClick(e, stretch)}
            data-id={stretch.id}
           >
             <div className="stretch-info">
               <h3>{stretch.name}</h3>
               <p>{stretch.description}</p>
               <span className="duration">{stretch.duration}s</span>
             </div>
             <div className="stretch-animation-container">
               {stretchAnimations[stretch.id]}
             </div>
             {isActive && (
               <div className="stretch-timer">
                 <CircularTimer
                   duration={stretch.duration}
                   currentTime={stretch.duration}
                   isActive={isActive}
                 />
               </div>
             )}
           </div>
         )}
       </Draggable>
    );
  };
  

  export default StretchItem;