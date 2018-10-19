const cheerio = require('cheerio');
const _ = require('lodash');
const MESSAGE_LEVELS = {
  // tag: 'class'
  default: 'default',
  primary: 'primary',
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  // alias
  comment: 'default',
  notice: 'primary',
  tips: 'info',
  error: 'danger',
}

/**
 * @link https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
 */
RegExp.escape= function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

hexo.extend.filter.register('after_post_render', function(data) {
  const $ = cheerio.load(data.content);

  $('blockquote').each(function(i) {
    let $blockquote = $(this);
    let blockquoteTextLower = _.toLower(_.trimStart($blockquote.text()));

    for (let messageLevel in MESSAGE_LEVELS) {
      let messageTag = `[${messageLevel}]`;

      if (_.startsWith(blockquoteTextLower, messageTag)) {
        let $p = $blockquote.find('p').first();
        let textNode = $p.get(0).childNodes[0];

        let messageClass = MESSAGE_LEVELS[messageLevel];
        $blockquote.addClass('message').addClass(`is-${messageClass}`);
        this.tagName = 'section';

        if (textNode.type === 'text') {
          let regexp = new RegExp(RegExp.escape(messageTag), 'i');
          textNode.data = textNode.data.replace(regexp, '');
        }
        if ($p.text() === '') {
          $p.remove();
        }

        break;
      }
    }
  });

  data.content = $.html();

  return data;
});
