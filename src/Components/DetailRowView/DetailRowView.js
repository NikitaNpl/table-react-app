import React from 'react';

export default ({person}) => (
    <div>
        Выбран пользователь <b>{person.firstName + ' ' + person.lastName}</b> <br/>
        Описание: <br/>
        <textarea defaultValue={person.description}/> <br/>
        Адрес проживания: <b>{person.address.streetAddress}</b> <br/>
        Город: <b>{person.address.city}</b> <br/>
        Провинция/штат: <b>{person.address.state}</b> <br/>
        Индекс: <b>{person.address.zip}</b>
    </div>
)
