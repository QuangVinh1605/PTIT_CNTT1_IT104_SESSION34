import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

import React from 'react';
import type { Student } from '../utils/types';
import StudentForm from './StudentForm';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';

function StudentList() {
  const dispatch = useAppDispatch();
  const { student: students } = useAppSelector((store) => store);
  const [editStudent, setEditStudent] = React.useState<Student | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [openDelete, setOpenDelete] = React.useState(false);

  // Mở modal xác nhận xóa
  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  // Xác nhận xóa
  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch({ type: "DELETE", payload: { id: deleteId } });
    }
    setOpenDelete(false);
    setDeleteId(null);
  };

  // Đóng modal
  const handleDeleteCancel = () => {
    setOpenDelete(false);
    setDeleteId(null);
  };

  // hàm sửa sinh viên
  const handleEdit = (student: Student) => {
    setEditStudent(student);
  };

  // hàm submit sửa sinh viên
  const handleEditSubmit = (student: Student) => {
    dispatch({ type: "EDIT", payload: student });
    setEditStudent(null);
  };

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Mã sinh viên</TableCell>
              <TableCell>Tên sinh viên</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không có sinh viên được tìm thấy
                </TableCell>
              </TableRow>
            ) : (
              students.map((s, i) => (
                <TableRow key={s.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{s.id}</TableCell>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.gender}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="contained" color="error">
                        Xem
                      </Button>
                      <Button variant="contained" color="warning" onClick={() => handleEdit(s)}>
                        Sửa
                      </Button>
                      <Button onClick={() => handleOpenDelete(s.id || "")} variant="contained" color="success">
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Modal xác nhận xóa */}
      <Dialog open={openDelete} onClose={handleDeleteCancel}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa sinh viên này?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Hủy</Button>
          <Button onClick={handleDeleteConfirm} color="error">Xóa</Button>
        </DialogActions>
      </Dialog>

      {/* Hiển thị form sửa nếu có sinh viên được chọn */}
      {editStudent && (
        <div style={{ marginTop: 24 }}>
          <h3>Sửa thông tin sinh viên</h3>
          <StudentForm initialStudent={editStudent} onSubmit={handleEditSubmit} />
        </div>
      )}
    </div>
  );
}

export default StudentList;
