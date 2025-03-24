import  React from "react"
import { useDrag } from "react-dnd"



const Item = ({ id, content, tabName }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "item",
    item: { id, tabName },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div ref={drag} className={`p-2 mb-2 bg-white rounded shadow ${isDragging ? "opacity-50" : ""}`}>
      {content}
    </div>
  )
}

export default Item

