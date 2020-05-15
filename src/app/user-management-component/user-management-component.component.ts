import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
@Component({
  selector: 'app-user-management-component',
  templateUrl: './user-management-component.component.html',
  styleUrls: ['./user-management-component.component.css']
})
export class UserManagementComponentComponent implements OnInit {

  myForm: FormGroup;
  userName: AbstractControl;
  id: AbstractControl;
  password: AbstractControl;
  users$: Observable<User>;
  baseUrl = 'http://127.0.0.1:8080/';
  currentUser: User;
  constructor(private fb: FormBuilder, private httpClient: HttpClient) {
    this.myForm = this.fb.group(
      {
        'userName': [''],
        'id': [''],
        'password': ['']
      }
    );
    this.userName = this.myForm.controls['userName'];
    this.id = this.myForm.controls['id'];
    this.password = this.myForm.controls['password'];
  }
  init() {
    this.myForm.controls['userName'].setValue("");
    this.myForm.controls['id'].setValue("");
    this.myForm.controls['password'].setValue("");
  }
  search() {
    if (this.id.value) {
      this.users$ = <Observable<User>>this.httpClient.get(this.baseUrl + 'users/' + this.id.value);
    }
    else {
      this.users$ = <Observable<User>>this.httpClient.get(this.baseUrl + 'users');
    }
  }
  add() {
    if (this.userName.value.length < 5 || this.password.value.length < 5) {
      alert('用户名或密码不得小于五位');
      this.init();
      this.search();
    }
    else {
      this.httpClient.post(this.baseUrl + 'user', this.myForm.value).subscribe((val: any) => {
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
  select(u: User) {
    this.currentUser = u;
    this.myForm.setValue(this.currentUser);
  }
  delete() {
    if (!this.currentUser) {
      alert('必须先选择用户！');
    }
    else {
      this.httpClient.delete(this.baseUrl + 'user/' + this.currentUser.id).subscribe((val: any) => {
        if (val.succ) {
          alert('删除成功');
          this.init();
          this.search();
        }
      })
    }
  }
  update() {
    if (!this.currentUser) {
      alert('必须先选择用户！');
    }
    else {
      if (this.userName.value.length < 5 || this.password.value.length < 5) {
        alert('用户名或密码不得小于五位');
        this.init();
        this.search();
      }
      else {
        if (this.currentUser.id != this.myForm.controls['id'].value) {
          alert('不能修改id');
          this.init();
          this.search();
        }
        this.httpClient.put(this.baseUrl + 'user', this.myForm.value).subscribe((val: any) => {
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
    this.users$ = <Observable<User>>this.httpClient.get(this.baseUrl + 'users');
  }

}
