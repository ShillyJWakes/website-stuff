import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import stateJson from '../../../../assets/states.json';
import { AuthService } from '../../../core/services/auth.service';
import { UsersService } from '../../services/users.service';
import { UserModel } from '../../../core/models/user.model';
import { PowService } from '../../services/pow.service';
import { PowModel } from '../../models/pow.model';

export interface InputInterface {
  type: string;
  label: string;
  value: string | undefined;
  classProp: string;
  validation: { validator: any; message: string; validationType: string }[];
  characterMax?: number;
  selectValue?: any;
  selectOptions?: { value: any; title: string | undefined }[];
}

export interface MessageInterface {
  success?: boolean | undefined;
  message?: string | undefined;
}

@Component({
  selector: 'app-fancy-form-input',
  templateUrl: './fancy-form-input.component.html',
  styleUrls: ['./fancy-form-input.component.scss'],
})
export class FancyFormInputComponent implements OnChanges, OnInit {
  @Input() inputs: InputInterface[] | undefined;
  @Input() model: string | undefined;
  @Input() editable: boolean = true;
  message: MessageInterface | undefined;
  @ViewChild('formOverlay') formOverlay: ElementRef | undefined;
  inputView = false;
  fancyForm: FormGroup = this._formBuilder.group({});
  isSubmitted = false;
  showToast: boolean | undefined;
  states: { name: string; abbreviation: string }[] = stateJson;
  private loggedUser: UserModel | undefined;

  constructor(
    private renderer: Renderer2,
    private _formBuilder: FormBuilder,
    private userService: UsersService,
    private authService: AuthService,
    private powService: PowService
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target === this.formOverlay?.nativeElement) {
        this.inputView = false;
      }
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.loggedUser = user;
    });
  }

  ngOnChanges() {
    this.showToast = this.message?.success;
    let formObject: { [key: string]: any } = {};
    this.inputs?.map((input) => {
      const value = input.type === 'select' ? input.selectValue : input.value;
      formObject[input.classProp] = [
        value,
        [
          ...input.validation.map((validator) => {
            return validator.validator;
          }),
        ],
      ];
    });
    this.fancyForm = this._formBuilder.group(formObject);
  }

  openInput() {
    this.inputView = !this.inputView;
  }

  submitForm() {
    this.showToast = false;
    this.message = {};
    this.isSubmitted = true;
    if (this.fancyForm.valid) {
      let newModel: any = {};
      this.inputs?.map((input) => {
        newModel[input.classProp] = this.fancyForm.value[input.classProp];
      });
      if (this.model === 'user') {
        this.userService.updateUser(newModel, this.loggedUser?.id).subscribe(
          (result) => {
            this.inputView = false;
            this.authService.setUser({
              ...result,
              token: this.loggedUser?.token,
            });
            this.message = { success: true, message: 'Info Saved' };
          },
          (error) => {
            this.message = {
              success: false,
              message: 'There was an issue',
            };
          }
        );
      } else if (this.model === 'pow') {
        const currentPow = this.powService.currentPow;
        this.powService
          .editPow(
            new PowModel({
              ...(newModel.first_class_term !== undefined
                ? { first_class_term: { id: newModel.first_class_term } }
                : { orientation_term: { id: newModel.orientation_term } }),
              id: currentPow?.id,
            })
          )
          .subscribe(
            (result) => {
              this.inputView = false;
              this.message = { success: true, message: 'Info Saved' };
              this.powService.getPow(currentPow?.id!).subscribe();
            },
            (error) => {
              this.message = {
                success: false,
                message: 'There was an issue',
              };
            }
          );
      }
      setTimeout(() => {
        this.message = {};
        this.showToast = false;
      }, 3000);
    }
  }
}
