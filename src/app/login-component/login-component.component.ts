import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
function userNameValidator(control: FormControl): { [s: string]: boolean } {
  if (!control.value.match(/^a/)) {
    return { invalidUser: true };
  }
}
@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {
  //登录表单
  myForm: FormGroup;
  //  用户名
  userName: AbstractControl;
  //密码
  password: AbstractControl;

  name$: Observable<string>;
  baseUrl = 'http://127.0.0.1:8080/';
  constructor(private authService: AuthService, private fb: FormBuilder, private httpClient: HttpClient) {
    this.myForm = this.fb.group(
      {
        'userName': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
        'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])]
      }
    );
    this.userName = this.myForm.controls['userName'];
    this.password = this.myForm.controls['password'];
    this.name$ = this.userName.valueChanges;
    this.userName.valueChanges.subscribe(val => {
      console.log(val);
    });
  }

  ngOnInit(): void {
  }

  onSubmit(value: any) {
    console.log(value);

  }
  login() {
    this.httpClient.post(this.baseUrl + 'users', this.myForm.value).subscribe((val: any) => {
      if (val.succ) {
        if (this.myForm.valid) {
          this.authService.login();
        }
      }
      else {
        alert('用户名或密码错误');
      }
    })

  }
}
