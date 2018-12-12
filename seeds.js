var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");

var data = [
    {
        name : "Cloud's Rest",
        image : "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350",
        description : "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus officiis veniam repellendus libero. Harum fuga atque consequatur impedit sapiente aspernatur, nulla, laborum cupiditate minima, unde ut! Asperiores odio veritatis quaerat."
    },
    {
        name : "Canyon Floor",
        image : "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&h=350",
        description : "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus officiis veniam repellendus libero. Harum fuga atque consequatur impedit sapiente aspernatur, nulla, laborum cupiditate minima, unde ut! Asperiores odio veritatis quaerat."
    },
    {
        name : "Desert Mesa",
        image : "https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&h=350",
        description : "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus officiis veniam repellendus libero. Harum fuga atque consequatur impedit sapiente aspernatur, nulla, laborum cupiditate minima, unde ut! Asperiores odio veritatis quaerat."
    }
];

function seedDB(){
    Campground.remove({}, (err) => {
        if(err) {
            console.log(err);
        }
        else {
            console.log("Removed");
            data.forEach((seed) => {
                Campground.create(seed, (err, campground) => {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        console.log("Added a campground");
                        Comment.create(
                            {
                                text : "This is great",
                                author : "Homer"
                            }, (err, comment) => {
                                if(err) {
                                    console.log(err);
                                }
                                else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Comment Created");
                                }
                            }
                        );
                    }
                });
            });
        }
    });
}

module.exports = seedDB;