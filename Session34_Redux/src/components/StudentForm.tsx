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

import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { useRef } from 'react';
function StudentForm({ onSubmit, initialStudent }: StudentFormProps) {
  const [errors, setErrors] = React.useState<{
    id?: string;
    name?: string;
    gender?: string;
    birthday?: string;
    hometown?: string;
    address?: string;
    age?: string;
  }>({});
  const dispatch = useAppDispatch();
  const students = useAppSelector((store) => store.student);
  const inputIdRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = React.useState<Student & { age?: number }>(
    initialStudent || {
      id: "",
      name: '',
      gender: 'Nam',
      birthday: '',
      hometown: '',
      address: '',
      age: undefined,
    }
  );

  React.useEffect(() => {
    if (initialStudent) {
      setForm(initialStudent);
    }
  }, [initialStudent]);

  const handleChange = (e: FormChangeEvent) => {
    const { name, value } = e.target;
    if (name === 'age') {
      setForm({ ...form, age: value === '' ? undefined : Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = () => {
    const newErrors: {
      id?: string;
      name?: string;
      gender?: string;
      birthday?: string;
      hometown?: string;
      address?: string;
      age?: string;
    } = {};
    // Validate mã sinh viên
    if (!form.id) newErrors.id = 'Vui lòng nhập mã sinh viên';
    else if (students.some(s => s.id === form.id && (!initialStudent || initialStudent.id !== form.id))) newErrors.id = 'Mã sinh viên đã tồn tại';
    // Validate tên sinh viên
    if (!form.name) newErrors.name = 'Vui lòng nhập tên sinh viên';
    else if (students.some(s => s.name === form.name && (!initialStudent || initialStudent.name !== form.name))) newErrors.name = 'Tên sinh viên đã tồn tại';
    // Validate tuổi
    if (form.age === undefined || form.age === null || form.age === '') newErrors.age = 'Vui lòng nhập tuổi';
    else if (form.age < 0) newErrors.age = 'Tuổi không được nhỏ hơn 0';
    // Validate ngày sinh
    if (!form.birthday) newErrors.birthday = 'Vui lòng nhập ngày sinh';
    else if (new Date(form.birthday) > new Date()) newErrors.birthday = 'Ngày sinh không được là ngày trong tương lai';
    // Validate nơi sinh
    if (!form.hometown) newErrors.hometown = 'Vui lòng nhập nơi sinh';
    // Validate địa chỉ
    if (!form.address) newErrors.address = 'Vui lòng nhập địa chỉ';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    // Thêm hoặc sửa
    const submitData = { ...form };
    if (onSubmit) {
      onSubmit(submitData);
      // Không reset form khi sửa
    } else {
      dispatch({ type: "ADD", payload: submitData });
      setForm({
        id: "",
        name: '',
        gender: 'Nam',
        birthday: '',
        hometown: '',
        address: '',
        age: undefined,
      });
      // Focus vào input mã sinh viên
      if (inputIdRef.current) inputIdRef.current.focus();
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
          inputRef={inputIdRef}
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
        <TextField
          label="Tuổi"
          name="age"
          type="number"
          value={form.age ?? ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.age}
          helperText={errors.age}
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
