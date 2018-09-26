const Immutable = require('immutable');
const assert = require('assert');


function transformErrors(errors) {
  console.log(errors);
  console.log('********************************')
  console.log('name: ' + errors.get('name').join('') + '.');
  console.log('********************************');
  console.log('age: ' + errors.get('age').join('. ') + '.');
  console.log('********************************');
  console.log('urls: ' + errors.get('urls'));
  console.log(errors.get('urls').get(2).getIn(['site', 'code']).get(0));
  console.log(errors.get('urls').get(2).getIn(['site', 'id']).get(0) + '.');
  console.log('********************************');
  console.log('url: ' + errors.getIn(['url', 'site', 'code']).join('. ') + '. ' + errors.getIn(['url', 'site', 'id']).join('. ') + '.');
  console.log('********************************');
  console.log('tags: ' + errors.get('tags'));
  console.log(errors.get('tags').get(1).getIn(['non_field_errors']).get(0));
  console.log(errors.get('tags').get(1).get('third_error').get(0) + ". ")
  console.log(errors.get('tags').get(3).get('non_field_errors').get(0) + ".")
  console.log('********************************');
  console.log('tag: ' + errors.getIn(['tag', 'nested', 'non_field_errors']).join('') + '.');
  return Immutable.Map();
}

it('should tranform errors', () => {
  // example error object returned from API converted to Immutable.Map
  const errors = Immutable.fromJS({
    name: ['This field is required'],
    age: ['This field is required', 'Only numeric characters are allowed'],
    urls: [{}, {}, {
      site: {
        code: ['This site code is invalid'],
        id: ['Unsupported id'],
      }
    }],
    url: {
      site: {
        code: ['This site code is invalid'],
        id: ['Unsupported id'],
      }
    },
    tags: [{}, {
      non_field_errors: ['Only alphanumeric characters are allowed'],
      another_error: ['Only alphanumeric characters are allowed'],
      third_error: ['Third error']
    }, {}, {
      non_field_errors: [
        'Minumum length of 10 characters is required',
        'Only alphanumeric characters are allowed',
      ],
    }],
    tag: {
      nested: {
        non_field_errors: ['Only alphanumeric characters are allowed'],
      },
    },
  });

  // in this specific case,
  // errors for `url` and `urls` keys should be nested
  // see expected object below
  const result = transformErrors(errors);

  assert.deepEqual(result.toJS(), {
    name: 'This field is required.',
    age: 'This field is required. Only numeric characters are allowed.',
    urls: [{}, {}, {
      site: {
        code: 'This site code is invalid.',
        id: 'Unsupported id.',
      },
    }],
    url: {
      site: {
        code: 'This site code is invalid.',
        id: 'Unsupported id.',
      },
    },
    tags: 'Only alphanumeric characters are allowed. Third error. ' +
      'Minumum length of 10 characters is required.',
    tag: 'Only alphanumeric characters are allowed.',
  });
});