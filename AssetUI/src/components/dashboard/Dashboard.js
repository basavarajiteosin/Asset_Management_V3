// import  React from "react"
// import { useState } from "react"
// import { DndProvider } from "react-dnd"
// import { HTML5Backend } from "react-dnd-html5-backend"
// import Item from "./Items"
// import { useDrop } from "react-dnd"

// const tabs = [
//   "Qualification",
//   "Need Analysis",
//   "Value Proposition",
//   "Identify Decision Makers",
//   "Proposal/Price Quote",
//   "Negotiation/Review",
// ]

// // Mock data
// const initialData = {
//   Qualification: [
//     { id: "q1", content: "Customer Budget" },
//     { id: "q2", content: "Decision Making Process" },
//   ],
//   "Need Analysis": [
//     { id: "n1", content: "Current Pain Points" },
//     { id: "n2", content: "Desired Outcomes" },
//   ],
//   "Value Proposition": [
//     { id: "v1", content: "Unique Selling Points" },
//     { id: "v2", content: "Competitor Comparison" },
//   ],
//   "Identify Decision Makers": [
//     { id: "d1", content: "Key Stakeholders" },
//     { id: "d2", content: "Influencers" },
//   ],
//   "Proposal/Price Quote": [
//     { id: "p1", content: "Pricing Strategy" },
//     { id: "p2", content: "Customized Solution" },
//   ],
//   "Negotiation/Review": [
//     { id: "r1", content: "Terms and Conditions" },
//     { id: "r2", content: "Final Approval Process" },
//   ],
// }

// const Dashboard = () => {
//   const [items, setItems] = useState(initialData)

//   const moveItem = (id, fromTab, toTab) => {
//     setItems((prevItems) => {
//       const newItems = { ...prevItems }
//       const itemIndex = newItems[fromTab].findIndex((item) => item.id === id)

//       if (itemIndex !== -1) {
//         const [movedItem] = newItems[fromTab].splice(itemIndex, 1)
//         newItems[toTab].push(movedItem)
//       }

//       return newItems
//     })
//   }

 
//   const TabContent = ({ tabName }) => {
//     const [, drop] = useDrop(() => ({
//       accept: "item",
//       drop: (item) => {
//         if (item.tabName !== tabName) {
//           moveItem(item.id, item.tabName, tabName);
//         }
//       },
//     }));

//     return (
//       <div ref={drop} className="min-h-[200px] p-4 bg-gray-100 rounded">
//         <h2 className="text-xl font-semibold mb-4">{tabName}</h2>
//         {items[tabName].map((item) => (
//           <Item key={item.id} id={item.id} content={item.content} tabName={tabName} />
//         ))}
//       </div>
//     )
//   }

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="container mx-auto p-4">
//         <h1 className="text-2xl font-bold mb-4">Sales Dashboard</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {tabs.map((tab) => (
//             <TabContent key={tab} tabName={tab} />
//           ))}
//         </div>
//       </div>
//     </DndProvider>
//   )
// }

// export default Dashboard

// import { useState } from "react"
// import { DndProvider, useDrag, useDrop } from "react-dnd"
// import { HTML5Backend } from "react-dnd-html5-backend"

// // Import Bootstrap CSS
// // import "bootstrap/dist/css/bootstrap.min.css"

// const tabs = [
//   "Qualification",
//   "Need Analysis",
//   "Value Proposition",
//   "Identify Decision Makers",
//   "Proposal/Price Quote",
//   "Negotiation/Review",
// ]

// // Mock data
// const initialData = {
//   Qualification: [
//     { id: "q1", content: "Customer Budget" },
//     { id: "q2", content: "Decision Making Process" },
//   ],
//   "Need Analysis": [
//     { id: "n1", content: "Current Pain Points" },
//     { id: "n2", content: "Desired Outcomes" },
//   ],
//   "Value Proposition": [
//     { id: "v1", content: "Unique Selling Points" },
//     { id: "v2", content: "Competitor Comparison" },
//   ],
//   "Identify Decision Makers": [
//     { id: "d1", content: "Key Stakeholders" },
//     { id: "d2", content: "Influencers" },
//   ],
//   "Proposal/Price Quote": [
//     { id: "p1", content: "Pricing Strategy" },
//     { id: "p2", content: "Customized Solution" },
//   ],
//   "Negotiation/Review": [
//     { id: "r1", content: "Terms and Conditions" },
//     { id: "r2", content: "Final Approval Process" },
//   ],
// }

// const Item = ({ id, content, tabName }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: "item",
//     item: { id, tabName },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }))

//   return (
//     <div ref={drag} className={`p-2 mb-2 bg-white rounded shadow ${isDragging ? "opacity-50" : ""}`}>
//       {content}
//     </div>
//   )
// }

// const Dashboard = () => {
//   const [items, setItems] = useState(initialData)
//   const [activeTab, setActiveTab] = useState(tabs[0])

//   const moveItem = (id, fromTab, toTab) => {
//     setItems((prevItems) => {
//       const newItems = { ...prevItems }
//       const itemIndex = newItems[fromTab].findIndex((item) => item.id === id)

//       if (itemIndex !== -1) {
//         const [movedItem] = newItems[fromTab].splice(itemIndex, 1)
//         newItems[toTab].push(movedItem)
//       }

//       return newItems
//     })
//   }

//   const TabContent = ({ tabName }) => {
//     const [, drop] = useDrop(() => ({
//       accept: "item",
//       drop: (item) => {
//         if (item.tabName !== tabName) {
//           moveItem(item.id, item.tabName, tabName)
//         }
//       },
//     }))

//     return (
//       <div ref={drop} className="min-h-200 p-4 bg-light rounded">
//         {items[tabName].map((item) => (
//           <Item key={item.id} id={item.id} content={item.content} tabName={tabName} />
//         ))}
//       </div>
//     )
//   }

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="container mt-4">
//         <h1 className="mb-4">Sales Dashboard</h1>
//         <ul className="nav nav-tabs mb-3" id="myTab" role="tablist">
//           {tabs.map((tab, index) => (
//             <li className="nav-item" role="presentation" key={tab}>
//               <button
//                 className={`nav-link ${activeTab === tab ? "active" : ""}`}
//                 id={`${tab}-tab`}
//                 data-bs-toggle="tab"
//                 data-bs-target={`#${tab}`}
//                 type="button"
//                 role="tab"
//                 aria-controls={tab}
//                 aria-selected={activeTab === tab}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab}
//               </button>
//             </li>
//           ))}
//         </ul>
//         <div className="tab-content" id="myTabContent">
//           {tabs.map((tab) => (
//             <div
//               key={tab}
//               className={`tab-pane fade ${activeTab === tab ? "show active" : ""}`}
//               id={tab}
//               role="tabpanel"
//               aria-labelledby={`${tab}-tab`}
//             >
//               <TabContent tabName={tab} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </DndProvider>
//   )
// }

// export default Dashboard

// import { useState } from "react"
// import { DndProvider, useDrag, useDrop } from "react-dnd"
// import { HTML5Backend } from "react-dnd-html5-backend"


// const tabs = [
//   "Qualification",
//   "Need Analysis",
//   "Value Proposition",
//   "Identify Decision Makers",
//   "Proposal/Price Quote",
//   "Negotiation/Review",
// ]

// // Mock data
// const initialData = {
//   Qualification: [
//     { id: "q1", content: "Customer Budget" },
//     { id: "q2", content: "Decision Making Process" },
//   ],
//   "Need Analysis": [
//     { id: "n1", content: "Current Pain Points" },
//     { id: "n2", content: "Desired Outcomes" },
//   ],
//   "Value Proposition": [
//     { id: "v1", content: "Unique Selling Points" },
//     { id: "v2", content: "Competitor Comparison" },
//   ],
//   "Identify Decision Makers": [
//     { id: "d1", content: "Key Stakeholders" },
//     { id: "d2", content: "Influencers" },
//   ],
//   "Proposal/Price Quote": [
//     { id: "p1", content: "Pricing Strategy" },
//     { id: "p2", content: "Customized Solution" },
//   ],
//   "Negotiation/Review": [
//     { id: "r1", content: "Terms and Conditions" },
//     { id: "r2", content: "Final Approval Process" },
//   ],
// }

// const Item = ({ id, content, tabName, moveItem }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: "item",
//     item: { id, tabName },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }))

//   return (
//     <div ref={drag} className={`p-2 mb-2 bg-white rounded shadow ${isDragging ? "opacity-50" : ""}`}>
//       {content}
//     </div>
//   )
// }

// const Tab = ({ name, items, moveItem }) => {
//   const [, drop] = useDrop(() => ({
//     accept: "item",
//     drop: (item) => {
//       if (item.tabName !== name) {
//         moveItem(item.id, item.tabName, name)
//       }
//     },
//   }))

//   return (
//     <div ref={drop} className="col">
//       <div className="card">
//         <div className="card-header">{name}</div>
//         <div className="card-body">
//           {items.map((item) => (
//             <Item key={item.id} id={item.id} content={item.content} tabName={name} moveItem={moveItem} />
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// const Dashboard = () => {
//   const [items, setItems] = useState(initialData)

//   const moveItem = (id, fromTab, toTab) => {
//     setItems((prevItems) => {
//       const newItems = { ...prevItems }
//       const itemIndex = newItems[fromTab].findIndex((item) => item.id === id)

//       if (itemIndex !== -1) {
//         const [movedItem] = newItems[fromTab].splice(itemIndex, 1)
//         newItems[toTab].push(movedItem)
//       }

//       return newItems
//     })
//   }

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="container mt-4">
//         <h1 className="mb-4">Sales Dashboard</h1>
//         <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
//           {tabs.map((tab) => (
//             <Tab key={tab} name={tab} items={items[tab]} moveItem={moveItem} />
//           ))}
//         </div>
//       </div>
//     </DndProvider>
//   )
// }

// export default Dashboard



// import { useState } from "react"
// import { DndProvider, useDrag, useDrop } from "react-dnd"
// import { HTML5Backend } from "react-dnd-html5-backend"



// const tabs = [
//   "Qualification",
//   "Need Analysis",
//   "Value Proposition",
//   "Identify Decision Makers",
//   "Proposal/Price Quote",
//   "Negotiation/Review",
// ]

// // Mock data
// const initialData = {
//   Qualification: [
//     { id: "q1", content: "Customer Budget" },
//     { id: "q2", content: "Decision Making Process" },
//   ],
//   "Need Analysis": [
//     { id: "n1", content: "Current Pain Points" },
//     { id: "n2", content: "Desired Outcomes" },
//   ],
//   "Value Proposition": [
//     { id: "v1", content: "Unique Selling Points" },
//     { id: "v2", content: "Competitor Comparison" },
//   ],
//   "Identify Decision Makers": [
//     { id: "d1", content: "Key Stakeholders" },
//     { id: "d2", content: "Influencers" },
//   ],
//   "Proposal/Price Quote": [
//     { id: "p1", content: "Pricing Strategy" },
//     { id: "p2", content: "Customized Solution" },
//   ],
//   "Negotiation/Review": [
//     { id: "r1", content: "Terms and Conditions" },
//     { id: "r2", content: "Final Approval Process" },
//   ],
// }

// const Item = ({ id, content, tabName }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: "item",
//     item: { id, tabName },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }))

//   return (
//     <div ref={drag} className={`p-2 mb-2 bg-white rounded shadow ${isDragging ? "opacity-50" : ""}`}>
//       {content}
//     </div>
//   )
// }

// const Dashboard = () => {
//   const [items, setItems] = useState(initialData)
//   const [activeTab, setActiveTab] = useState(tabs[0])

//   const moveItem = (id, fromTab, toTab) => {
//     setItems((prevItems) => {
//       const newItems = { ...prevItems }
//       const itemIndex = newItems[fromTab].findIndex((item) => item.id === id)

//       if (itemIndex !== -1) {
//         const [movedItem] = newItems[fromTab].splice(itemIndex, 1)
//         newItems[toTab].push(movedItem)
//       }

//       return newItems
//     })
//   }

//   const TabContent = ({ tabName }) => {
//     const [, drop] = useDrop(() => ({
//       accept: "item",
//       drop: (item) => {
//         if (item.tabName !== tabName) {
//           moveItem(item.id, item.tabName, tabName)
//         }
//       },
//     }))

//     return (
//       <div ref={drop} className="min-h-200 p-4 bg-light rounded">
//         {items[tabName].map((item) => (
//           <Item key={item.id} id={item.id} content={item.content} tabName={tabName} />
//         ))}
//       </div>
//     )
//   }

//   const TabButton = ({ tab }) => {
//     const [, drop] = useDrop(() => ({
//       accept: "item",
//       drop: (item) => {
//         if (item.tabName !== tab) {
//           moveItem(item.id, item.tabName, tab)
//         }
//       },
//     }))

//     return (
//       <li className="nav-item" role="presentation" key={tab}>
//         <button
//           ref={drop}
//           className={`nav-link ${activeTab === tab ? "active" : ""}`}
//           id={`${tab}-tab`}
//           data-bs-toggle="tab"
//           data-bs-target={`#${tab}`}
//           type="button"
//           role="tab"
//           aria-controls={tab}
//           aria-selected={activeTab === tab}
//           onClick={() => setActiveTab(tab)}
//         >
//           {tab}
//         </button>
//       </li>
//     )
//   }

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className=" mt-4">
//         {/* <h1 className="mb-4">Sales Dashboard</h1> */}
//         <ul className="nav nav-tabs mb-3" id="myTab" role="tablist">
//           {tabs.map((tab) => (
//             <TabButton key={tab} tab={tab} />
//           ))}
//         </ul>
//         <div className="tab-content" id="myTabContent">
//           {tabs.map((tab) => (
//             <div
//               key={tab}
//               className={`tab-pane fade ${activeTab === tab ? "show active" : ""}`}
//               id={tab}
//               role="tabpanel"
//               aria-labelledby={`${tab}-tab`}
//             >
//               <TabContent tabName={tab} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </DndProvider>
//   )
// }

// export default Dashboard



// import { useState } from "react"
// import { DndProvider, useDrag, useDrop } from "react-dnd"
// import { HTML5Backend } from "react-dnd-html5-backend"

// const tabs = [
//   "Qualification",
//   "Need Analysis",
//   "Value Proposition",
//   "Identify Decision Makers",
//   "Proposal/Price Quote",
//   "Negotiation/Review",
// ]

// // Mock data
// const initialData = {
//   Qualification: [
//     { id: "q1", content: "Customer Budget" },
//     { id: "q2", content: "Decision Making Process" },
//   ],
//   "Need Analysis": [
//     { id: "n1", content: "Current Pain Points" },
//     { id: "n2", content: "Desired Outcomes" },
//   ],
//   "Value Proposition": [
//     { id: "v1", content: "Unique Selling Points" },
//     { id: "v2", content: "Competitor Comparison" },
//   ],
//   "Identify Decision Makers": [
//     { id: "d1", content: "Key Stakeholders" },
//     { id: "d2", content: "Influencers" },
//   ],
//   "Proposal/Price Quote": [
//     { id: "p1", content: "Pricing Strategy" },
//     { id: "p2", content: "Customized Solution" },
//   ],
//   "Negotiation/Review": [
//     { id: "r1", content: "Terms and Conditions" },
//     { id: "r2", content: "Final Approval Process" },
//   ],
// }

// const Item = ({ id, content, tabName }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: "item",
//     item: { id, tabName },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }))

//   return (
//     <div ref={drag} className={`p-2 mb-2 bg-white rounded shadow ${isDragging ? "opacity-50" : ""}`}>
//       {content}
//     </div>
//   )
// }

// const Dashboard = () => {
//   const [items, setItems] = useState(initialData)

//   const moveItem = (id, fromTab, toTab) => {
//     setItems((prevItems) => {
//       const newItems = { ...prevItems }
//       const itemIndex = newItems[fromTab].findIndex((item) => item.id === id)

//       if (itemIndex !== -1) {
//         const [movedItem] = newItems[fromTab].splice(itemIndex, 1)
//         newItems[toTab].push(movedItem)
//       }

//       return newItems
//     })
//   }

//   const TabContent = ({ tabName }) => {
//     const [, drop] = useDrop(() => ({
//       accept: "item",
//       drop: (item) => {
//         if (item.tabName !== tabName) {
//           moveItem(item.id, item.tabName, tabName)
//         }
//       },
//     }))

//     return (
//       <div ref={drop} className="h-100 p-3 bg-light rounded">
//         <h5 className="mb-3">{tabName}</h5>
//         {items[tabName].map((item) => (
//           <Item key={item.id} id={item.id} content={item.content} tabName={tabName} />
//         ))}
//       </div>
//     )
//   }

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="container-fluid mt-4">
//         <div className="row">
//           {tabs.map((tab) => (
//             <div key={tab} className="col-md-4 col-lg-2 mb-4">
//               <TabContent tabName={tab} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </DndProvider>
//   )
// }

// export default Dashboard

import { useState } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

const tabs = [
  "Prospecting",
  "Qualification",
  "Need Analysis",
  "Proposal",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
]

// Mock data
const initialData = {
  Prospecting: [
    { id: "q1", content: "Customer Budget" },
    { id: "q2", content: "Decision Making Process" },
  ],
  Qualification: [
    { id: "q1", content: "Customer Budget" },
    { id: "q2", content: "Decision Making Process" },
  ],
  "Need Analysis": [
    { id: "n1", content: "Current Pain Points" },
    { id: "n2", content: "Desired Outcomes" },
  ],
  "Proposal": [
    { id: "v1", content: "Unique Selling Points" },
    { id: "v2", content: "Competitor Comparison" },
  ],
  "Negotiation": [
    { id: "d1", content: "Key Stakeholders" },
    { id: "d2", content: "Influencers" },
  ],
  "Closed Won": [
    { id: "p1", content: "Pricing Strategy" },
    { id: "p2", content: "Customized Solution" },
  ],
  "Closed Lost": [
    { id: "r1", content: "Terms and Conditions" },
    { id: "r2", content: "Final Approval Process" },
  ],
}

const Item = ({ id, content, tabName }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "item",
    item: { id, tabName },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div ref={drag} className={`dashboard-drag-content p-2 mb-2 bg-white rounded shadow ${isDragging ? "opacity-50" : ""}`}>
      {content}
    </div>
  )
}

const Dashboard = () => {
  const [items, setItems] = useState(initialData)

  const moveItem = (id, fromTab, toTab) => {
    setItems((prevItems) => {
      const newItems = { ...prevItems }
      const itemIndex = newItems[fromTab].findIndex((item) => item.id === id)

      if (itemIndex !== -1) {
        const [movedItem] = newItems[fromTab].splice(itemIndex, 1)
        newItems[toTab].push(movedItem)
      }

      return newItems
    })
  }

  const TabContent = ({ tabName }) => {
    const [, drop] = useDrop(() => ({
      accept: "item",
      drop: (item) => {
        if (item.tabName !== tabName) {
          moveItem(item.id, item.tabName, tabName)
        }
      },
    }))

    return (
      <div ref={drop} className="h-100 p-3 bg-light dashbaord-tab-content">
        {items[tabName].map((item) => (
          <Item key={item.id} id={item.id} content={item.content} tabName={tabName} />
        ))}
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="content mt-4">
        <div className="d-flex dashboard-main-card">
          {tabs.map((tab) => (
            <div key={tab} className="mb-4">
              {/* Heading as a button-like design */}
              <div className="dashboard-tab-headings">
  <span>{tab}</span>
</div>

              <TabContent tabName={tab} />
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  )
}

export default Dashboard
