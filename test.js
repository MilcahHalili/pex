const Immutable = require('immutable');
const assert = require('assert');

function transformErrors(errors) {
  return Immutable.Map({
    'name': errors.get('name').join('') + '.',
    'age': errors.get('age').join('. ') + '.',
    'tag': errors.getIn(['tag', 'nested', 'non_field_errors']).join('') + '.',
    'url': {
      'site': {
        'code': errors.getIn(['url', 'site', 'code']).get("0") + '.',
        'id': errors.getIn(['url', 'site', 'id']).get("0") + '.'
      }
    },
    'urls': [{}, {}, {
      'site': {
        'code': errors.get('urls').get(2).getIn(['site', 'code']).get(0) + '.',
        'id': errors.get('urls').get(2).getIn(['site', 'id']).get(0) + '.',
      }
    }],
    'tags': errors.get('tags').get(1).get('non_field_errors').get(0) + ". " +
      errors.get('tags').get(1).get('third_error').get(0) + ". " +
      errors.get('tags').get(3).get('non_field_errors').get(0) + ".",
  });
}

it('should tranform errors', () => {
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