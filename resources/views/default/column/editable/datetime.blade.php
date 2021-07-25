<a href="#"
    {!! $attributes !!}
    data-name="{{ $name }}"
    data-value="{{ $value }}"
    data-url="{{ $url }}"
    data-type="{{ $type }}"
    data-format = "{{ $format }}"
    data-viewformat = "{{ $viewformat }}"
    data-mode="{{ $mode }}"
    data-combodate="{{ $combodateValue  }}"
    data-pk="{{ $id }}"
    data-disabled="{{ !$isEditable }}"
>{{ $text }}</a>

{!! $append !!}
