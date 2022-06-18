//  Hàm validator  --> constructor function --> Điối tượng
//  options là object
function Validator(options) {
  // input invalud value
  var selectorRules = {};

  function addInvalid(errorElement, inputElement, errMessage) {
    errorElement.innerText = errMessage;
    inputElement.parentElement.classList.add("invalid");
  }
  function addValid(errorElement, inputElement) {
    errorElement.innerText = "";
    inputElement.parentElement.classList.remove("invalid");
  }
  //  Ham thực hiện validate form group
  function validate(inputElement, rule) {
    var errorElement = inputElement.parentElement.querySelector(
      options.errSelector
    );
    var errMessage = rule.test(inputElement.value);
    errMessage
      ? addInvalid(errorElement, inputElement, errMessage)
      : addValid(errorElement, inputElement, errMessage);
      
      var rules=selectorRules[rule.selector]
      rules.forEach(()=>{
        
      })
  }

  var formElement = document.querySelector(options.form);
  if (formElement) {
    options.rule.forEach((rule) => {
      //  save rule
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }


      var inputElement = formElement.querySelector(rule.selector);

      if (inputElement) {
        //  xử lý khi blur ra ngoài
        inputElement.onblur = () => {
          //  get value
          //  get test function
          validate(inputElement, rule);
        };
        //  Xử lý khi người dùng nhập input
        inputElement.oninput = () => {
          var errorElement = inputElement.parentElement.querySelector(
            options.errSelector
          );
          addValid(errorElement, inputElement);
        };
      }
    });
  }
}
//  Định nghĩa rule
//  Nguyeen tawcs cuar rule
//  khi co lỗi trả ra message lỗi :
// Không lỗi ==> undefined

Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: (value) => {
      return value.trim() ? undefined : message || "Vui lòng nhập thông tin";
    },
  };
};
Validator.isEmail = (selector, message) => {
  return {
    selector: selector,
    test: (value) => {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      //  Tại sao là regex .text
      return regex.test(value)
        ? undefined
        : message || "Trường này phải là email";
    },
  };
};
Validator.isPassword = (selector, message) => {
  return {
    selector: selector,
    test: (value) => {
      var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]{8,}$/;
      //  Tại sao là regex .text
      return regex.test(value)
        ? undefined
        : message ||
            "Vui lòng nhâp mật khẩu chứa từ 8-32 ký tự, chứa ít nhất một ký tự đặc biệt";
    },
  };
};
Validator.isConfirmPassword = (selector, isConfirmValue, message) => {
  return {
    selector: selector,
    test: (value) => {
      return value === isConfirmValue()
        ? undefined
        : message || "Giá trị nhập vào không chính xác";
    },
  };
};
