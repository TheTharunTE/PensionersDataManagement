const { foreach } = require("@sap/cds");
const e = require("express");

module.exports = function (){
      this.on ('READ','userdetails', async req => {

        const sfOdataServiceCon = await cds.connect.to('sfodataservice');

       //Email Picklist 

       let ecEmailTypeResponse = await sfOdataServiceCon.send(
        { 
            query: 'GET /odata/v2/PickListV2(effectiveStartDate=datetime\'1900-01-01T00:00:00\',id=\'ecEmailType\')/values?$format=JSON&$select=externalCode,optionId,label_defaultValue', 
            data: 'json',
            headers: { 'Content-Type': 'application/json',
                       'Authorization': 'Basic c2ZhZG1pbkBTRkNQQVJUMDAxOTAxOlBhcnRAZGM2OA=='
                     } 
        });
        const ecEmailType = [];
        ecEmailTypeResponse["d"]["results"].forEach(emailType => {
            let eType = {
                "optionId" : emailType.optionId,
                "label": emailType.label_defaultValue
            };
            ecEmailType.push(eType);
        });

        //Phone Picklist 
        let ecPhoneTypeResponse = await sfOdataServiceCon.send(
            { 
                query: 'GET /odata/v2/PickListV2(effectiveStartDate=datetime\'1900-01-01T00:00:00\',id=\'ecPhoneType\')/values?$format=JSON&$select=externalCode,optionId,label_defaultValue', 
                data: 'json',
                headers: { 'Content-Type': 'application/json',
                           'Authorization': 'Basic c2ZhZG1pbkBTRkNQQVJUMDAxOTAxOlBhcnRAZGM2OA=='
                         } 
            });

        const ecPhoneType = [];
        ecPhoneTypeResponse["d"]["results"].forEach(phoneType => {
            let eType = {
                "optionId" : phoneType.optionId,
                "label": phoneType.label_defaultValue
            };
            ecPhoneType.push(eType);
        });

        //Address Picklists
          // 1. Territory(Country)
       /* let territoryResponse = await sfOdataServiceCon.send(
            { 
                query: 'GET /odata/v2/Territory', 
                data: 'json',
                headers: { 'Content-Type': 'application/json',
                           'Authorization': 'Basic c2ZhZG1pbkBTRkNQQVJUMDAxOTAxOlBhcnRAZGM2OA=='
                         } 
            });

        const territories = [];
        territoryResponse["d"]["results"].forEach(territory => {
            let eType = {
                "territoryCode" : territory.territoryCode,
                "territoryName": territory.territoryName
            };
            territories.push(eType);
        }); */


        //Country
        let countryResponse = await sfOdataServiceCon.send(
            { 
                query: 'GET /odata/v2/Country?$select=code,externalName_defaultValue,externalName_en_US&$format=JSON', 
                data: 'json',
                headers: { 'Content-Type': 'application/json',
                           'Authorization': 'Basic c2ZhZG1pbkBTRkNQQVJUMDAxOTAxOlBhcnRAZGM2OA=='
                         } 
            });

        const countries = countryResponse["d"]["results"].map(country => ({ code: country.code, externalName_defaultValue: country.externalName_defaultValue })); 
        
        /*countryResponse["d"]["results"].forEach(country => {
            let eType = {
                "code" : country.code,
                "externalName_en_US": country.externalName_en_US,
                "externalName_defaultValue": country.externalName_defaultValue
            };
            countries.push(eType);
        });*/

       //Payment  

       // 1. PayType(mian/payroll)
       // 2. PaymentMethod
       // 3. Bank Country/Region - Done
       // 4. Bank
       // 5. Currency - Done


       let currencyResponse = await sfOdataServiceCon.send(
        { 
            query: 'GET /odata/v2/Currency', 
            data: 'json',
            headers: { 
                       'Content-Type': 'application/json',
                       'Authorization': 'Basic c2ZhZG1pbkBTRkNQQVJUMDAxOTAxOlBhcnRAZGM2OA=='
                     } 
        });

    const currency = currencyResponse["d"]["results"].map(curr => ({ code: curr.code, externalName_defaultValue: curr.externalName_defaultValue }));
   /*currencyResponse["d"]["results"].forEach(curr => {
        let eType = {
            "description_defaultValue" : curr.description_defaultValue,
            "code": curr.code,
            "externalName_defaultValue": curr.externalName_defaultValue
        };
        currency.push(eType);
    });*/

    //Payment Method
    let paymentMethodResponse = await sfOdataServiceCon.send(
        { 
            query: 'GET /odata/v2/PaymentMethodV3?$select=externalCode,externalName_en_US', 
            data: 'json',
            headers: { 'Content-Type': 'application/json',
                       'Authorization': 'Basic c2ZhZG1pbkBTRkNQQVJUMDAxOTAxOlBhcnRAZGM2OA=='
                     } 
        });

    const paymentMethods = paymentMethodResponse["d"]["results"].map(paymentMethod => ({externalCode : paymentMethod.externalCode, externalName_en_US : paymentMethod.externalName_en_US }));
    /*paymentMethodResponse["d"]["results"].forEach(paymentMethod  => {
        let eType = {
            "externalCode": paymentMethod.externalCode,
            "externalName_en_US": paymentMethod.externalName_en_US
        };
        paymentMethods.push(eType);
    });*/
       

       
        let perPersonResponse = await sfOdataServiceCon.send({ query: 'GET /odata/v2/PerPerson(60006)?$format=JSON&$expand=emailNav,phoneNav,homeAddressNavDEFLT,personalInfoNav', data: 'json', headers: { 'Content-Type': 'application/xml', 'Authorization': 'Basic c2ZhZG1pbkBTRkNQQVJUMDAxOTAxOlBhcnRAZGM2OA==' } });
        let oDataResponse =  perPersonResponse["d"];
        const peraddresses = [];
        oDataResponse.homeAddressNavDEFLT["results"].forEach(address => {
          //  let countryLabelFilter = countries.filter((eType)=> eType.code===address.country);
            let addressInfo = {
                addressType: address.addressType,
                startDate: address.startDate,
                country: address.country,
                //countryLabel: countryLabelFilter[0].externalName_defaultValue,
                zipCode: address.zipcode,
                city: address.city,
                county: address.county,
                address1: address.address1,
                address2: address.address2,
                address3: address.address3,
                address4: address.address4,
                state: address.state,
                province: address.province
            };
            peraddresses.push(addressInfo);
        });

        const peremails = [];
        oDataResponse.emailNav["results"].forEach(email => {
            let emailTypelabel = ecEmailType.filter((eType)=> eType.optionId===email.emailType);
           
            let emailInfo = {
                "emailType": email.emailType,
                "emailAddress": email.emailAddress,
                "isPrimary": email.isPrimary,
                "label" :  emailTypelabel[0].label
            };
            peremails.push(emailInfo);
        });

        const perphones = [];
        oDataResponse.phoneNav["results"].forEach(phone => {
            let phoneTypelabel = ecPhoneType.filter((pType)=> pType.optionId===phone.phoneType);
            let phoneInfo = {
                "phoneType": phone.phoneType,
                "extension": phone.extension,
                "areaCode": phone.areaCode,
                "phoneNumber": phone.phoneNumber,
                "countryCode": phone.countryCode,
                "isPrimary": phone.isPrimary,
                "label" :  phoneTypelabel[0].label
            };
            perphones.push(phoneInfo);
        });
        let response = await sfOdataServiceCon.send(
            { 
                query: 'GET /odata/v2/PaymentInformationV3?$format=JSON&$expand=toPaymentInformationDetailV3&$filter=worker eq \'60006\'', 
                data: 'json',
                headers: { 'Content-Type': 'application/json',
                           'Authorization': 'Basic c2ZhZG1pbkBTRkNQQVJUMDAxOTAxOlBhcnRAZGM2OA=='
                         } 
            });
        const paymentInfoDetails = [];
        let paymentInformationDetailV3Local = response["d"]["results"][0].toPaymentInformationDetailV3;
        paymentInformationDetailV3Local["results"].forEach(paymentDetail => {
            let currDescription = currency.filter((cType)=> cType.code===paymentDetail.currency);
            let payment = {
              //  "__metadata": paymentDetail.__metadata,
                "PaymentInformationV3_effectiveStartDate": paymentDetail.PaymentInformationV3_effectiveStartDate,
                "PaymentInformationV3_worker": paymentDetail.PaymentInformationV3_worker,
                "externalCode": paymentDetail.externalCode,
                "bankCountry": paymentDetail.bankCountry,
                "bank": paymentDetail.bank,
                "paySequence": paymentDetail.paySequence,
                "payType": paymentDetail.payType,
                "accountOwner": paymentDetail.accountOwner,
                "iban": paymentDetail.iban,
                "areaCodpayTypee": paymentDetail.areaCodpayTypee,
                "paymentMethod": paymentDetail.paymentMethod,
                "percent": paymentDetail.percent,
                "currency": paymentDetail.currency,
                //"currencyDescription" : currDescription[0].description_defaultValue,
                "amount": paymentDetail.amount,
                "accountNumber": paymentDetail.accountNumber,
                "routingNumber": paymentDetail.routingNumber,
                "customPayType": paymentDetail.customPayType,
                "purpose": paymentDetail.purpose
            };
            paymentInfoDetails.push(payment);
        });
        let paymentInfo = {"effectiveStartDate": "/Date(1726963200000)/",
                "worker": "60006",
                "paymentInformationdetailV3": paymentInfoDetails
                };


       // Object.assign({}, "paymentInfoDetails")
        const userdetails = {'personId': oDataResponse.personId,
            'personIdExternal'    : oDataResponse.personIdExternal,
            'addressInfo' : peraddresses,
            'emails': peremails,
            'phones': perphones,
            'paymentInformation': paymentInfo,
            'ecemailtypes': ecEmailType,
            'ecphonetype': ecPhoneType,
            //'territories': territories,
            //'currency': currency,
            'countries': countries,
            'paymentMethods': paymentMethods
        };
        return userdetails;
      });
      this.on ('CREATE','userdetails', async req => {
        const userdetails = req.data;
        console.log(userdetails);
        const sfOdataServiceCon = await cds.connect.to('sfodataservice');
        //AddressInfo Update
        if(userdetails.addressInfo != null && userdetails.addressInfo.length > 0) {
            const peraddresses = [];
            userdetails.addressInfo.forEach((address) => {
                address = { __metadata: { "uri": "PerAddressDEFLT", "type": "SFOData.PerAddressDEFLT" }, personIdExternal: '60006', ...address };
                peraddresses.push(address);
            })           
            let perAddressDEFLTResponse = await sfOdataServiceCon.send({ query: 'POST /odata/v2/upsert', headers: { 'Authorization': 'Basic c2ZhZG1pbkBTRkNQQVJUMDAxOTAxOlBhcnRAZGM2OA==' }, data: peraddresses });
            console.log(perAddressDEFLTResponse);        
        }

        //Emails update
        if(userdetails.emails != null && userdetails.emails.length > 0) {
            const peremails = [];   
            userdetails.emails.forEach((email) => {
                email = {
                    __metadata: { "uri": "PerEmail(emailType='" + email.emailType + "',personIdExternal='60006')", "type": "SFOData.PerEmail" },
                    emailAddress: email.emailAddress,
                    isPrimary: email.isPrimary
                };
                peremails.push(email);
            })
            let perEmailResponse = await sfOdataServiceCon.send({ query: 'POST /odata/v2/upsert?purgeType=full', headers: { 'Authorization': 'Basic c2ZhZG1pbkBTRkNQQVJUMDAxOTAxOlBhcnRAZGM2OA==' }, data: peremails });
            console.log(perEmailResponse);        
        }

        //Phones Update
        if(userdetails.phones != null && userdetails.phones != undefined && userdetails.phones.length > 0) {
            const perphones = [];   
            userdetails.phones.forEach((phone) => {
                phone = {
                    __metadata: { "uri": "PerPhone", "type": "SFOData.PerPhone" },
                    personIdExternal: '60006',
                    phoneType: phone.phoneType,
                    areaCode: phone.areaCode,
                    phoneNumber: phone.phoneNumber,
                    extension: phone.extension,
                    countryCode: phone.countryCode,
                    isPrimary: phone.isPrimary
                };
                perphones.push(phone);
            })
            let perPhoneResponse = await sfOdataServiceCon.send({ query: 'POST /odata/v2/upsert', headers: { 'Authorization': 'Basic c2ZhZG1pbkBTRkNQQVJUMDAxOTAxOlBhcnRAZGM2OA==' }, data: perphones });
            console.log(perPhoneResponse);        
        }
        
         if(userdetails.paymentInformation != null && userdetails.paymentInformation != undefined && userdetails.paymentInformation.paymentInformationdetailV3.length > 0) {
            const paymentInformationdetailV3Array = [];   
            let payment = '';
            userdetails.paymentInformation.paymentInformationdetailV3.forEach((paymentDetail) => {
                
                payment = {
                    __metadata: { "uri": "PaymentInformationDetailV3", "type": "SFOData.PaymentInformationDetailV3" },
                    PaymentInformationV3_effectiveStartDate: paymentDetail.PaymentInformationV3_effectiveStartDate,
                    PaymentInformationV3_worker: paymentDetail.PaymentInformationV3_worker,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                    bankCountry: paymentDetail.bankCountry,
                    payType: paymentDetail.payType,
                    //paySequence: paymentDetail.paySequence,
                    iban: paymentDetail.iban,
                    paymentMethod: paymentDetail.paymentMethod,
                    areaCodpayTypee: paymentDetail.areaCodpayTypee,
                    percent: paymentDetail.percent,
                    currency: paymentDetail.currency,
                    amount: paymentDetail.amount,
                    accountOwner: paymentDetail.accountOwner,
                    accountNumber: paymentDetail.accountNumber,
                    routingNumber: paymentDetail.routingNumber,
                    customPayType: paymentDetail.customPayType,
                    purpose: paymentDetail.purpose                
                };
                if(paymentDetail.externalCode != undefined && paymentDetail.externalCode != null && paymentDetail.externalCode != "") {
                    payment = Object.assign( {"externalCode" : paymentDetail.externalCode}, payment);
                } 
                if(paymentDetail.bank != undefined && paymentDetail.bank != null && paymentDetail.bank != "") {
                    payment = Object.assign( {bank: paymentDetail.bank}, payment);
                } 
                payment = Object.assign({__metadata: { "uri": "PaymentInformationDetailV3", "type": "SFOData.PaymentInformationDetailV3" }}, payment)
                paymentInformationdetailV3Array.push(payment);
            });
            let paymentPayload = {
                 "__metadata": {"uri": "PaymentInformationV3","type": "SFOData.PaymentInformationV3"},
                 "effectiveStartDate": userdetails.paymentInformation.effectiveStartDate,
                 "worker": userdetails.paymentInformation.worker,
                 "toPaymentInformationDetailV3" : paymentInformationdetailV3Array
              }
            let paymentInformationV3Response = await sfOdataServiceCon.send({ query: 'POST /odata/v2/upsert', headers: { 'Authorization': 'Basic c2ZhZG1pbkBTRkNQQVJUMDAxOTAxOlBhcnRAZGM2OA==' }, data: paymentPayload});
            console.log(paymentInformationV3Response);        
        }
        return req.data;
      });
      this.on ('deleteperaddress','', async req => {
        var addressInfo = req.data.addressInfo;
        const peraddresses = [];
        var startDate = "/Date("+ new Date().valueOf()+")/";
        var t  = new Date().toISOString().substring(0,19);
        const sfOdataServiceCon = await cds.connect.to('sfodataservice');
        addressInfo.forEach((address) => {
            //address.startDate = "/Date(1729209600000)/";
            address.startDate = startDate;
            console.log(address.startDate);
            address = { __metadata: { "uri": "PerAddressDEFLT", "type": "SFOData.PerAddressDEFLT" }, personIdExternal: '60006', ...address };
            peraddresses.push(address);
        })           
        let perAddressDEFLTResponse = await sfOdataServiceCon.send({ query: 'POST /odata/v2/upsert?purgeType=full', headers: { 'Authorization': 'Basic c2ZhZG1pbkBTRkNQQVJUMDAxOTAxOlBhcnRAZGM2OA==' }, data: peraddresses });
        console.log(perAddressDEFLTResponse);
        });
      this.on ('deleteperphone','', async req => {
            var phone = req.data.phones[0];
            const sfOdataServiceCon = await cds.connect.to('sfodataservice');
            phone = {
                    __metadata: { "uri": "PerPhone", "type": "SFOData.PerPhone" },
                    personIdExternal: '60006',
                    phoneType: phone.phoneType,
                    areaCode: phone.areaCode,
                    phoneNumber: phone.phoneNumber,
                    extension: phone.extension,
                    countryCode: phone.countryCode,
                    isPrimary: phone.isPrimary,
                    "operation" : "DELETE"
                };
            let perPhoneResponse = await sfOdataServiceCon.send({ query: 'POST /odata/v2/upsert', headers: { 'Authorization': 'Basic c2ZhZG1pbkBTRkNQQVJUMDAxOTAxOlBhcnRAZGM2OA==' }, data: phone });
            console.log(perPhoneResponse);        
            });
            this.on ('deleteperemail','', async req => {
                var email = req.data.emails;
                const peremails = [];
                var startDate = "/Date("+ new Date().valueOf()+")/";
                var t  = new Date().toISOString().substring(0,19);
                const sfOdataServiceCon = await cds.connect.to('sfodataservice');
               // emails.forEach((email) => {
                    //address.startDate = "/Date(1729209600000)/";
                email = {
                        __metadata: { "uri": "PerEmail(emailType='" + email.emailType + "',personIdExternal='60006')", "type": "SFOData.PerEmail" },
                        emailAddress: email.emailAddress,
                        isPrimary: email.isPrimary,
                        "operation" : "DELETE"
                    };
                    //peremails.push(email);
               // })
                let perEmailResponse = await sfOdataServiceCon.send({ query: 'POST /odata/v2/upsert', headers: { 'Authorization': 'Basic c2ZhZG1pbkBTRkNQQVJUMDAxOTAxOlBhcnRAZGM2OA==' }, data: email });
                console.log(perEmailResponse);        
                });
            this.on ('deleteperpaymentdetails','', async req => {
                    var paymentDetail = req.data.paymentInformationdetails[0];
                    const sfOdataServiceCon = await cds.connect.to('sfodataservice');
                    var date = eval('new ' + paymentDetail.PaymentInformationV3_effectiveStartDate.replace(/\//g, ''));
                    var uri =  '/odata/v2/PaymentInformationDetailV3(PaymentInformationV3_effectiveStartDate=datetime\''+ date.toISOString().substring(0,19) + '\',PaymentInformationV3_worker=\''+ paymentDetail.PaymentInformationV3_worker+'\',externalCode='+ paymentDetail.externalCode +')';
                    let perPaymentDeleteResponse = await sfOdataServiceCon.send({ query: 'DELETE '+uri, headers: { 'Authorization': 'Basic c2ZhZG1pbkBTRkNQQVJUMDAxOTAxOlBhcnRAZGM2OA==' }});
                    console.log(perPaymentDeleteResponse);        
                    });
      
  }