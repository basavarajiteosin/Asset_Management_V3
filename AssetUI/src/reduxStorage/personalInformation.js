// import { createSlice } from '@reduxjs/toolkit'
// import { capitalizeText } from '../common/textOperations';

// export const personalInformation = createSlice({
//     name: "Personal Information",
//     initialState: {
//         userID: "",
//         userName: "",
//         userRole: "",
//         displayName: "",
//         emailAddress: "",
//         menuItemNames: "",
//         token: "",
//         profilePic: "",
//         firstName: "",
//         lastName: "",
//         clientId: "",
//         department: "",
//     },

//     reducers: {
//         setUserPersonalInformation: (state, action) => {
//             return state = {
//                 userID: action.payload.userID,
//                 userName: capitalizeText(action.payload.userName),
//                 userRole: action.payload.userRole,
//                 displayName: action.payload.displayName,
//                 emailAddress: action.payload.emailAddress,
//                 menuItemNames: action.payload.menuItemNames,
//                 token: action.payload.token,
//                 profilePic: action.payload.profilePic,
//                 firstName: action.payload.firstName,
//                 lastName: action.payload.lastName,
//                 clientId: action.payload.clientId,
//                 department: action.payload.department
//             }
//         },

//         changePersonalInfo: (state, action) => {
//             return state = {
//                 ...state, 
//                 profilePic: action.payload.profilePic,
//             }
//         },

//         changeApplicationClientIdAndMenuItems: (state, action) => {
//             return state = {
//                 ...state, 
//                 clientId: action.payload.clientId,
//                 menuItemNames:action.payload.menuItemNames,
//             }
//         },

//     },
// })

// export const { setUserPersonalInformation, changePersonalInfo, changeApplicationClientIdAndMenuItems } = personalInformation.actions;

// export default personalInformation.reducer;


import { createSlice } from '@reduxjs/toolkit'
import { capitalizeText } from '../common/textOperations';

export const personalInformation = createSlice({
    name: "Personal Information",
    initialState: {
        userID: "",
        userName: "",
        userRole: "",
        displayName: "",
        emailAddress: "",
        menuItemNames: "",
        token: "",
        profilePic: "",
        firstName: "",
        lastName: "",
        clientId: "",
        department: "",
    },

    reducers: {
        setUserPersonalInformation: (state, action) => {
            return state = {
                userID: action.payload.userID,
                userName: capitalizeText(action.payload.userName),
                userRole: action.payload.userRole,
                displayName: action.payload.displayName,
                emailAddress: action.payload.emailAddress,
                menuItemNames: action.payload.menuItemNames,
                token: action.payload.token,
                profilePic: action.payload.profilePic,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                clientId: action.payload.clientId,
                department: action.payload.department
            }
        },

                changePersonalInfo: (state, action) => {
            return state = {
                ...state, 
                profilePic: action.payload.profilePic,
            }
        },


        changeApplicationClientIdAndMenuItems: (state, action) => {
            return state = {
                ...state, 
                clientId: action.payload.clientId,
                menuItemNames:action.payload.menuItemNames,
            }
        },

    },
})

export const { setUserPersonalInformation, changePersonalInfo, changeApplicationClientIdAndMenuItems } = personalInformation.actions;

export default personalInformation.reducer;

