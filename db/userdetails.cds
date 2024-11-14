namespace techenvo.pensioners.userdetailsservice;

@cds.persistence.skip
entity userdetails {
  key personId      : String;
      personIdExternal    : String;
      countryOfBirth : String;
     // personalinfo : Composition of one personalinfo;
      addressInfo :  Composition of many peraddress;
      emails: Composition of many peremail;
      phones: Composition of many perphone;
      paymentInformation: Composition of paymentInformation; 
      ecemailtypes: Composition of many paymentInformation;
}
@cds.persistence.skip
entity personalinfo {
    key firstName : String;
    lastName : String;
    middleName: String;
    gender: String;
    //maritalstatus
    //preferred Language
    salutation: String; //This is searchpicker
    //Preferred Name
    nationality: String;
}
@cds.persistence.skip
entity peraddress {
   key addressType: String;
    personIdExternal: String;
    startDate: String;
    country: String;
    countryLabel: String;
    zipCode: String;
    city: String;
    county: String;
    address2: String;
    address1: String;
    address3: String;
    address4: String;
    state: String;
    province: String;
};
@cds.persistence.skip
entity peremail {
  key emailType: String;
  label : String;
  emailAddress: String;
  isPrimary: Boolean;
}
@cds.persistence.skip
entity perphone {
  key phoneType: String;
  extension: String;
  countryCode: Integer64;
  areaCode: Integer64;
  phoneNumber: String;
  isPrimary: Boolean;
}
@cds.persistence.skip
entity paymentInformation {
  key effectiveStartDate: String;
  worker: String;
  paymentInformationdetailV3: Composition of many paymentInformationdetailV3;
}
@cds.persistence.skip
entity paymentInformationdetailV3 {
  PaymentInformationV3_effectiveStartDate: String;
  externalCode: String;
  key PaymentInformationV3_worker: String;
  bankCountry: String;
  paySequence: Integer;
  bank: String;
  payType: String;
  accountOwner: String;
  iban: String;
  areaCodpayTypee: String;
  paymentMethod: String;
  percent: Integer64;
  currency: String;
  currencyDescription: String;
  amount: String;
  customPayType: String;
  purpose: String;
  routingNumber: String;
  accountNumber: String;
}
