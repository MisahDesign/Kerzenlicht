var Product = require("../models/product");

var mongoose = require('mongoose');

mongoose.connect("mongodb+srv://misah:w9AcfjsFakqkD3wq@cluster0-lygfd.mongodb.net/test?retryWrites=true&w=majority", {dbName: 'kerzenlicht'});


console.log("eeee");

var data = [ 
    new Product({
    name: 'Moisture Surge Intense',
    image: 'https://cdn.flaconi.de/media/catalog/product/c/l/clinique-moisture-surge-intense-gesichtscreme-30-ml-020714492212.jpg',
    price: 14.99,
    info: 'Entdecken Sie die reichhaltige Feuchtigkeitspflege aus der Moisture Surge Pflegelinie. Ein konzentrierter, luxuriöser Moisturizer, der die Haut 24 Stunden lang mit intensiver Feuchtigkeit versorgt und die Feuchtigkeitsbarriere nachhaltig repariert.'
}),
new Product({
    name: 'Hydra Zen',
    image: 'https://cdn.flaconi.de/media/catalog/300x/l/a/lancome-hydra-zen-neurocalm-fuer-trockene-haut-gesichtscreme-50-ml.jpg',
    price: 45.99,
    info: 'Entdecken Sie die reichhaltige Feuchtigkeitspflege aus der Moisture Surge Pflegelinie. Ein konzentrierter, luxuriöser Moisturizer, der die Haut 24 Stunden lang mit intensiver Feuchtigkeit versorgt und die Feuchtigkeitsbarriere nachhaltig repariert.'
}),
new Product({
    name: 'Kneipp Regeneration',
    image: 'https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjdp4HRtpnkAhX_wAIHHWxJCL0QjRx6BAgBEAQ&url=https%3A%2F%2Fwww.mueller.de%2Fp%2Fkneipp-regeneration-24-h-gesichtscreme-738722%2F&psig=AOvVaw2TDmnLjglIVSX2gXY9Dnd2&ust=1566664135817216',
    price: 13.99,
    info: 'Entdecken Sie die reichhaltige Feuchtigkeitspflege aus der Moisture Surge Pflegelinie. Ein konzentrierter, luxuriöser Moisturizer, der die Haut 24 Stunden lang mit intensiver Feuchtigkeit versorgt und die Feuchtigkeitsbarriere nachhaltig repariert.'
}),
new Product({
    name: 'L-Carnosine',
    image: 'https://media.douglas.de/040241/900_0/Dr_Susanne_von_Schmiedeberg-Gesichtscreme-L_Carnosine_Anti_A_G_E_Cream_fur_trockene_Haut.jpg',
    price: 23.99,
    info: 'Entdecken Sie die reichhaltige Feuchtigkeitspflege aus der Moisture Surge Pflegelinie. Ein konzentrierter, luxuriöser Moisturizer, der die Haut 24 Stunden lang mit intensiver Feuchtigkeit versorgt und die Feuchtigkeitsbarriere nachhaltig repariert.'
}),
new Product({
    name: 'Creme de jour',
    image: 'https://media.manufactum.de/is/image/Manufactum/750s_shop/gesichtscreme-mandeloel--81289_01.jpg',
    price: 19.99,
    info: 'Entdecken Sie die reichhaltige Feuchtigkeitspflege aus der Moisture Surge Pflegelinie. Ein konzentrierter, luxuriöser Moisturizer, der die Haut 24 Stunden lang mit intensiver Feuchtigkeit versorgt und die Feuchtigkeitsbarriere nachhaltig repariert.'
})

    
];


function seedProducts(){
data.forEach(function(product){
    Product.create(product, function(err, data){
        if (err) {
            console.log(err);
        } else {
            console.log('product.name');
        }
    });
});
};

module.exports = seedProducts();

