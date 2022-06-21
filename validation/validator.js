//  Hàm validator  --> constructor function --> Điối tượng
//  options là object
function Validator(options) {
  // input invalud value
  var selectorRules = {};
  function getParentElement(inputElement, selector) {
    // var errorElement = inputElement.parentElement.querySelector(options.errSelector.)
    while (inputElement.parentElement) {
      if (inputElement.parentElement.matches(selector)) {
        return inputElement.parentElement;
      }
      inputElement = inputElement.parentElement;
    }
  }
  function addInvalid(errorElement, inputElement, errMessage) {
    errorElement.innerText = errMessage;
    getParentElement(inputElement, options.formGroupSelector).classList.add(
      "invalid"
    );
  }
  function addValid(errorElement, inputElement) {
    errorElement.innerText = "";
    getParentElement(inputElement, options.formGroupSelector).classList.remove(
      "invalid"
    );
  }
  //  Ham thực hiện validate form group
  function validate(inputElement, rule) {
    // var errorElement = inputElement.parentElement.querySelector(options.errSelector);
    var errorElement = getParentElement(
      inputElement,
      options.formGroupSelector
    ).querySelector(options.errSelector);

    var errMessage;

    var rules = selectorRules[rule.selector];

    //Lặp qua từng rule và kiểm tra nếu mà có lỗi thì dừng việc kiểm tra
    for (var i = 0; i < rules.length; i++) {
      switch (inputElement.type) {
        case "radio":
        case "checkbox":
          errMessage = rules[i](
            formElement.querySelector(rule.selector + ":checked")
          );
          // console.log(rule.selector + ":checked");
          break;
        default:
          errMessage = rules[i](inputElement.value);
      }
      // emessage đầu tiển tìm được

      var rules = selectorRules[rule.selector];
      if (errMessage) break;
    }
    errMessage
      ? addInvalid(errorElement, inputElement, errMessage)
      : addValid(errorElement, inputElement, errMessage);
    return !errMessage;
  }

  var formElement = document.querySelector(options.form);
  if (formElement) {
    formElement.onsubmit = (e) => {
      e.preventDefault();
      var isFormValid = true;
      // LẶp từng rule để vadidate
      options.rules.forEach((rule) => {
        var inputElement = formElement.querySelector(rule.selector);
        isFormValid = validate(inputElement, rule);
      });

      if (isFormValid) {
        // submit với js
        if (typeof options.onSubmit === "function") {
          var enableInputs = formElement.querySelectorAll(
            "[name]:not([disabled])"
          );
          var formValues = Array.from(enableInputs).reduce(function(values, input)  {
            //  gán input.value cho value[input.name] sau đó trả về values
            // return (values[input.name] = input.value) && values;
            switch (input.type) {
              case "radio":
                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                break;
              case "checkbox":
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = [];
                }
                // Kiểm tra  nếu không checked
                if (input.matches(":checked")) {
                  values[input.name].push(input.value);
                }
                // console.log(input,!input.matches(":checked"),input.value,values[input.name],values)
                break;
              case "file":
                values[input.name] = input.files;
                break;
              default:
                values[input.name] = input.value;
                // console.log(input.type,input.name,input.value,!input.matches(":checked"))
            }
            //  Nếu phần tử là mảng mà không có phần tử nào thì trả về chuỗi rỗng
            if(values[input.name].length==0)values[input.name]='';
            return values;
          }, {});
          // console.log(formValues);
          options.onSubmit(formValues);
        }
        // submit
        else {
          formElement.submit();
        }
      } else {
        // console.log(" có lỗi  ");
      }
    };
    //  LẶp qua mỗi rule và xử lý thông tin các in input trong form
    options.rules.forEach((rule) => {
      //  save rule
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      var inputElements = formElement.querySelectorAll(rule.selector);
      Array.from(inputElements).forEach(function (inputElement) {
        if (inputElement) {
          //  xử lý khi blur ra ngoài
          inputElement.onblur = () => {
            //  get value
            //  get test function
            validate(inputElement, rule);
          };
          //  Xử lý khi người dùng nhập input
          inputElement.oninput = () => {
            var errorElement = getParentElement(
              inputElement,
              options.formGroupSelector
            ).querySelector(options.errSelector);
            addValid(errorElement, inputElement);
          };
        }
      });
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
      return value ? undefined : message || "Vui lòng nhập thông tin";
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
