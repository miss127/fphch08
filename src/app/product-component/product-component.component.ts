import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from './student';
@Component({
  selector: 'app-product-component',
  templateUrl: './product-component.component.html',
  styleUrls: ['./product-component.component.css']
})
export class ProductComponentComponent implements OnInit {

  myForm: FormGroup;
  userName: AbstractControl;
  id: AbstractControl;
  web: AbstractControl;
  rfid: AbstractControl;
  students$: Observable<Student>;
  baseUrl = 'http://127.0.0.1:1207/';
  currentStudent: Student;
  constructor(private fb: FormBuilder, private httpClient: HttpClient) {
    this.myForm = this.fb.group(
      {
        'id': [''],
        'userName': [''],
        'web': [''],
        'rfid': ['']
      }
    );
    this.id = this.myForm.controls['id'];
    this.userName = this.myForm.controls['userName'];
    this.web = this.myForm.controls['web'];
    this.rfid = this.myForm.controls['rfid'];
  }
  init() {
    this.myForm.controls['id'].setValue("");
    this.myForm.controls['userName'].setValue("");
    this.myForm.controls['web'].setValue("");
    this.myForm.controls['rfid'].setValue("");
  }
  search() {
    if (this.id.value) {
      this.students$ = <Observable<Student>>this.httpClient.get(this.baseUrl + 'students/' + this.id.value);
    }
    else {
      this.students$ = <Observable<Student>>this.httpClient.get(this.baseUrl + 'students');
    }
  }
  add() {
    if (this.userName.value.length == 0 || this.web.value.length == 0 || this.rfid.value.length == 0) {
      alert('姓名或成绩不能为空');
      this.init();
      this.search();
    }
    else {
      this.httpClient.post(this.baseUrl + 'student', this.myForm.value).subscribe((val: any) => {
        if (val.succ) {
          alert('添加成功！');
          this.init();
          this.search();
        }
        else {
          alert('id已存在，添加失败！');
          this.init();
          this.search();
        }
      })
    }
  }
  select(s: Student) {
    this.currentStudent = s;
    this.myForm.setValue(this.currentStudent);
  }
  delete() {
    if (!this.currentStudent) {
      alert('必须先选择用户！');
    }
    else {
      this.httpClient.delete(this.baseUrl + 'student/' + this.currentStudent.id).subscribe((val: any) => {
        if (val.succ) {
          alert('删除成功');
          this.init();
          this.search();
        }
      })
    }
  }
  update() {
    if (!this.currentStudent) {
      alert('必须先选择用户！');
    }
    else {
      if (this.userName.value.length == 0 || this.web.value.length == 0 || this.rfid.value.length == 0) {
        alert('姓名或成绩不能为空');
        this.init();
        this.search();
      }
      else {
        if (this.currentStudent.id != this.myForm.controls['id'].value) {
          alert('不能修改id');
          this.init();
          this.search();
        }
        this.httpClient.put(this.baseUrl + 'student', this.myForm.value).subscribe((val: any) => {
          if (val.succ) {
            alert('修改成功');
            this.init();
            this.search();
          }
        })
      }
    }
  }
  ngOnInit(): void {
    this.students$ = <Observable<Student>>this.httpClient.get(this.baseUrl + 'students');
  }
}
