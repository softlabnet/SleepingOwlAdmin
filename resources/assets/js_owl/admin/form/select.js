Admin.Modules.register('form.elements.select', () => {
    $('.input-select').each((e, item) => {
        let options = {
		width: '100%'
	    },
            $self = $(item);

        if ($self.hasClass('input-taggable')) {
            options['tags'] = true;
        }

        $self.select2(options)
    })
}, 0, ['bootstrap::tab::shown'])