const Joi = require('joi');
const express = require('express');
const app = express(); 
const { engine } = require('express-handlebars');

app.engine('hbs', engine({
    layoutsDir: `${__dirname}/views/layouts`,
    extname: 'hbs',
    defaultLayout: 'index'
}));
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.json());


app.get('/', (req, res) => {
    res.render('courses', {courses: courses});
});

const courses = [
    { id: 1, name: 'HTML', credits: 3, duration: '1 month', mandatory: false },
    { id: 2, name: 'CSS', credits: 4, duration: '1.5 months', mandatory: false },
    { id: 3, name: 'JavaScript', credits: 9, duration: '3 months', mandatory: true },
    { id: 4, name: 'PHP', credits: 5, duration: '2 months', mandatory: false },
    { id: 5, name: 'Java', credits: 6, duration: '2.5 months', mandatory: true },
    { id: 6, name: 'Python', credits: 5, duration: '2 months', mandatory: true },
    { id: 7, name: 'Data science', credits: 3, duration: '1.5 months', mandatory: false },
    { id: 8, name: 'React', credits: 4, duration: '1.5 months', mandatory: false },
    { id: 9, name: 'Node Js', credits: 2, duration: '1 month', mandatory: false },
    { id: 10, name: 'C++', credits: 5, duration: '2 months', mandatory: true }
];

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name,
        credits: req.body.credits,
        duration: req.body.duration,
        mandatory: req.body.mandatory
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found!');

    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    course.credits = req.body.credits;
    course.duration = req.body.duration;
    course.mandatory = req.body.mandatory;
    res.send(course);
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required(),
        credits: Joi.number().required(),
        duration: Joi.string().required(),
        mandatory: Joi.boolean().required()
    };
    return Joi.validate(course, schema);
}

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found!');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found!');
    res.send(course);
});

const port = process.env.PORT  || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));