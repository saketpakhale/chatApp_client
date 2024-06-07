import { useEffect } from "react";




const ContextMenu = ({posX, posY, handleDelete, handleCopy}) => {

    
    return (
        <menu style={{
            position:'absolute',
            top:`${posY + 2}px`,
            left:`${posX + 2}px`,
            width:'120px',
            backgroundColor:'grey',
            borderRadius: '10px',
            padding: '5px'
        }}>
            <button style={buttonStyle} onClick={handleDelete}>Delete</button>
            <button style={buttonStyle} onClick={handleCopy}>Copy Text</button>
        </menu>
    )
}

export default ContextMenu;


const buttonStyle = {
    backgroundColor: 'grey',
    border: 'none',
    color: 'white',
    textAlign: 'center',
    padding:'5px 15px',
    cursor: 'pointer'

}