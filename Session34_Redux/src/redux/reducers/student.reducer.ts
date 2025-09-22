import type { Student } from "../../utils/types"

const studentLocal = localStorage.getItem('students')

const studentInitial: Student[] = studentLocal ? JSON.parse(studentLocal) : []

type ActionTypes = {
    type: "ADD" | "EDIT" | "DELETE" | 'SEARCH' | "FILTER" | "SORT",
    payload: Student
}

const studentReducer = (state = studentInitial, action: ActionTypes) => {
   switch (action.type) {
    case "ADD":
        { const stuentClones = [...state, action.payload];
        
        // Lưu dữ liệu lên localStorage
        localStorage.setItem("students", JSON.stringify(stuentClones))
        return stuentClones }
    
        case "DELETE": 
        { const filterStudent = state.filter(st=> st.id !== action.payload.id)

           // Lưu dữ liệu lên localStorage
        localStorage.setItem("students", JSON.stringify(filterStudent))
        return filterStudent }

    
        case "SEARCH":
        {
            // Luôn lọc trên dữ liệu gốc (studentInitial hoặc localStorage)
            const allStudents = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')!) : [];
            if (action.payload.name) {
                const searchStudent = allStudents.filter((student: Student) =>
                    (student.name ?? '').toLowerCase().includes((action.payload.name ?? '').toLowerCase())
                );
                return searchStudent;
            } else {
                return allStudents;
            }
        }

        case "EDIT":
        {
            const updatedStudents = state.map(student =>
                student.id === action.payload.id ? { ...student, ...action.payload } : student
            );
            localStorage.setItem("students", JSON.stringify(updatedStudents));
            return updatedStudents;
        }

   
    default:
        break;
   }
    
    return state
}

export default studentReducer