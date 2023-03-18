import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { PowService } from '../../../shared/services/pow.service';
import { InputInterface } from '../../../shared/components/fancy-form-input/fancy-form-input.component';
import { Validators } from '@angular/forms';
import stateJson from '../../../../assets/states.json';

@Component({
  selector: 'app-examine',
  templateUrl: './examine.component.html',
  styleUrls: ['./examine.component.scss'],
})
export class ExamineComponent implements OnInit {
  loggedUser: UserModel | undefined;
  nameInputs: InputInterface[] | undefined;
  addressInputs: InputInterface[] | undefined;
  telephoneInput: InputInterface[] | undefined;
  states: { name: string; abbreviation: string }[] = stateJson;

  constructor(
    private authenticationService: AuthService,
    private powService: PowService
  ) {
    this.powService.removeCurrentPow();
  }

  ngOnInit() {
    this.authenticationService.currentUser$.subscribe((user) => {
      this.loggedUser = user;
      this.telephoneInput = [
        {
          type: 'text',
          label: 'Telephone',
          value: this.loggedUser?.telephone,
          classProp: 'telephone',
          validation: [
            {
              validationType: 'required',
              validator: Validators.required,
              message: 'A telephone is required',
            },
            {
              validationType: 'pattern',
              validator: Validators.pattern(
                '^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$'
              ),
              message: 'Please enter a valid phone number',
            },
          ],
        },
      ];
      this.addressInputs = [
        {
          type: 'address',
          label: 'Address',
          value: this.loggedUser?.address,
          classProp: 'address',
          validation: [
            {
              validationType: 'required',
              validator: Validators.required,
              message: 'An address is required',
            },
          ],
        },
        {
          type: 'address',
          label: 'Apt',
          value: this.loggedUser?.address2,
          classProp: 'address2',
          validation: [],
        },
        {
          type: 'address',
          label: 'City',
          value: this.loggedUser?.city,
          classProp: 'city',
          validation: [
            {
              validationType: 'required',
              validator: Validators.required,
              message: 'A city is required',
            },
          ],
        },
        {
          type: 'select',
          label: 'State',
          value: this.loggedUser?.state,
          classProp: 'state',
          selectValue: this.states.find(
            (state) => state.name === this.loggedUser?.state
          )!.abbreviation!,
          validation: [
            {
              validationType: 'required',
              validator: Validators.required,
              message: 'A state is required',
            },
          ],
        },
        {
          type: 'address',
          label: 'Zip Code',
          value: this.loggedUser?.zipCode,
          classProp: 'zip_code',
          validation: [
            {
              validationType: 'required',
              validator: Validators.required,
              message: 'A zipcode is required',
            },
          ],
        },
        {
          type: 'address',
          label: 'Country',
          value: this.loggedUser?.country,
          classProp: 'country',
          validation: [
            {
              validationType: 'required',
              validator: Validators.required,
              message: 'A country is required',
            },
          ],
        },
      ];
      this.nameInputs = [
        {
          type: 'name',
          label: 'First Name',
          value: this.loggedUser?.firstName,
          classProp: 'first_name',
          validation: [
            {
              validationType: 'required',
              validator: Validators.required,
              message: 'A first name is required',
            },
          ],
        },
        {
          type: 'name',
          label: 'Middle Initial',
          value: this.loggedUser?.middleIn,
          classProp: 'middle_name',
          validation: [
            {
              validationType: 'maxLength',
              validator: Validators.maxLength(1),
              message: 'Only middle Initial is needed',
            },
          ],
          characterMax: 1,
        },
        {
          type: 'name',
          label: 'Last Name',
          value: this.loggedUser?.lastName,
          classProp: 'last_name',
          validation: [
            {
              validationType: 'required',
              validator: Validators.required,
              message: 'A last name is required',
            },
          ],
        },
      ];
    });
    this.powService
      .getActivePow(
        this.loggedUser?.userRoles?.filter(
          (userRole) => userRole?.role?.role === 'student'
        )[0].id
      )
      .subscribe();
  }
}
