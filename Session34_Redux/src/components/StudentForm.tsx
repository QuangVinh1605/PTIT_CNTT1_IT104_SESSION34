import {
  Button,
  MenuItem,
  Select,
  TextField,
  type SelectChangeEvent,
} from '@mui/material';

import React from 'react';
import type { Student } from '../utils/types';

interface StudentFormProps {
  onSubmit?: (student: Student) => void;
  initialStudent?: Student;
}

type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type FormChangeEvent = InputChangeEvent | SelectChangeEvent;

import { useAppDispatch } from '../hooks/useRedux';
function StudentForm({ onSubmit, initialStudent }: StudentFormProps) {
  const [errors, setErrors] = React.useState<{
    id?: string;
    name?: string;
    gender?: string;
    birthday?: string;
    hometown?: string;
    address?: string;
  }>({});
  const dispatch = useAppDispatch();
  const [form, setForm] = React.useState<Student>(
    initialStudent || {
      id: "",
      name: '',
      gender: 'Nam',
      birthday: '',
      hometown: '',
      address: '',
    }
  );

  React.useEffect(() => {
    if (initialStudent) {
      setForm(initialStudent);
    }
  }, [initialStudent]);

  const handleChange = (e: FormChangeEvent) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    const newErrors: {
      id?: string;
      name?: string;
      gender?: string;
      birthday?: string;
      hometown?: string;
      address?: string;
    } = {};
    if (!form.id) newErrors.id = 'Vui lòng nhập mã sinh viên';
    if (!form.name) newErrors.name = 'Vui lòng nhập tên sinh viên';
    if (!form.gender) newErrors.gender = 'Vui lòng chọn giới tính';
    if (!form.birthday) newErrors.birthday = 'Vui lòng nhập ngày sinh';
    if (!form.hometown) newErrors.hometown = 'Vui lòng nhập nơi sinh';
    if (!form.address) newErrors.address = 'Vui lòng nhập địa chỉ';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    if (onSubmit) {
      onSubmit(form);
      // Không reset form khi sửa
    } else {
      dispatch({ type: "ADD", payload: form });
      setForm({
        id: "",
        name: '',
        gender: 'Nam',
        birthday: '',
        hometown: '',
        address: '',
      });
    }
    setErrors({});
  };
  
  return (
    <div className="w-1/3 p-4 border rounded-xl shadow">
      <h2 className="font-semibold mb-4">Thông Tin Sinh Viên</h2>
      <div className="flex flex-col gap-4">
        <TextField
          label="Mã sinh viên"
          name="id"
          value={form.id}
          onChange={handleChange}
          fullWidth
          error={!!errors.id}
          helperText={errors.id}
        />
        <TextField
          label="Tên sinh viên"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          error={!!errors.name}
          helperText={errors.name}
        />
        <Select name="gender" value={form.gender} onChange={handleChange} fullWidth error={!!errors.gender}>
          <MenuItem value="Nam">Nam</MenuItem>
          <MenuItem value="Nữ">Nữ</MenuItem>
        </Select>
        {errors.gender && <span style={{ color: 'red', fontSize: 13 }}>{errors.gender}</span>}
        <TextField
          type="date"
          label="Ngày sinh"
          name="birthday"
          value={form.birthday}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          error={!!errors.birthday}
          helperText={errors.birthday}
        />
        <TextField
          label="Nơi sinh"
          name="hometown"
          value={form.hometown}
          onChange={handleChange}
          fullWidth
          error={!!errors.hometown}
          helperText={errors.hometown}
        />
        <TextField
          label="Địa chỉ"
          name="address"
          value={form.address}
          onChange={handleChange}
          fullWidth
          error={!!errors.address}
          helperText={errors.address}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}

export default StudentForm;
