using {techenvo.pensioners.userdetailsservice as userdetailsvc} from '../db/userdetails';

@protocol:'rest'
@Capabilities.KeyAsSegmentSupported : true
service userdetailsservice {

  @open
  type object {};

  entity userdetails as projection on userdetailsvc.userdetails;
  
  action deleteperaddress (addressInfo: object);

  action deleteperemail (emails: object);

  action deleteperphone (phones: object);

  action deleteperpaymentdetails (paymentInformationdetails: object);
}