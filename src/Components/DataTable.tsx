import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table'; // Import the Table component

interface Student { id: number; name: string; risk_score: number; }

function DataTable() {
    const [students, setStudents] = useState<Student[]>([]);


    // Fetch data from your backend when the component loads
    useEffect(() => {
        // This is where you'd call your API (e.g., using axios)
        // For now, we'll use mock data.
        const mockStudentData = [
            { id: 20743976, name: "Aaliyah Doyle", risk_score: 85.2 },
            { id: 94334509, name: "Aaron Moran", risk_score: 32.5 },
            { id: 36814683, name: "Abdula Kennedy", risk_score: 12.0 },
        ];
        setStudents(mockStudentData);
    }, []);

    return (
        <div>
            <h2>Student Risk Dashboard</h2>
            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Risk Score (1-100)</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {/* Loop over your 'students' state variable to create a row for each */}
                {students.map((student) => (
                    <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.name}</td>
                        <td>{student.risk_score.toFixed(2)}</td>
                        <td>
                            <button className="btn btn-sm btn-primary">Details</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default DataTable;