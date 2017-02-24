const config      = require("../../config/config.js");
const request     = require('request');

function PEER_AIDE_SEARCH_COURSES(router) {
    var self = this;
    self.handleRoutes(router);
}


PEER_AIDE_SEARCH_COURSES.prototype.handleRoutes = function(router) {

    var self = this;

    var courseName;
    var courseDept;
    var courseCode;
    var selected_university;
    var course_department;
    var courseTermSpecifiedByUser;
    var overall_curr_rating;
    var easiness_curr_rating;
    var toughness_curr_rating;
    var clarity_curr_rating;
    var helpfulness_curr_rating;
    var course_offering_time;
    var course_descr;
    var date;
    var str_month;
    var temp_str_month;
    var prof_full_name;
    var overall_num_users_rated;
    var professor_first_name;
    var professor_last_name;
    var professor_joined_full_name;
    var professor_name_field;
    var professor_name_field_not_null   = false;
    var professor_not_found             = false;
    var profsNameChosen                 = "";

    router.get("/peeraide_api/course_name",function (req,res) {
        
        courseDept                  = req.query['course_name'].trim();
        courseCode                  = req.query['course_code'].trim();
        selected_university         = req.query['unis'];
        courseTermSpecifiedByUser   = req.query['term'];
        professor_name_field        = req.query['professor_name'].trim();

        if(professor_name_field == "") {
            profsNameChosen = "none supplied";
        } else {
            profsNameChosen = professor_name_field;
        }

        var postData = {
            courseTitles: courseDept,
            courseCodes: courseCode,
            chosenUniversity: selected_university,
            courseSession: courseTermSpecifiedByUser,
            professorName: profsNameChosen
        }

        var url = 'https://peeraide.herokuapp.com/peeraide_api/peeraide_courses_handler/course_name'
        var options = {
            method: 'post',
            body:   postData,
            json:   true,
            url:    url
        }

        request(options, function (err, res1, body) {
            if (err) {
                console.log(err);
            } else {
                if(body.grant_type == 'course found') {
                    date                            = new Date();
                    overall_curr_rating             = body.course_data.overall_curr_rating;
                    easiness_curr_rating            = body.course_data.easiness_curr_rating;
                    toughness_curr_rating           = body.course_data.toughness_curr_rating;
                    clarity_curr_rating             = body.course_data.clarity_curr_rating;
                    helpfulness_curr_rating         = body.course_data.helpfulness_curr_rating;
                    courseName                      = body.course_data.courseName;
                    overall_num_users_rated         = body.course_data.overall_num_users_rated;


                    prof_full_name                  = body.course_data.professor_joined_full_name;
                    course_offering_time            = body.course_data.courseSession;
                    course_department               = body.course_data.cDep;
                    course_descr                    = body.course_data.course_description;
                    selected_university             = body.course_data.chosenUniveristy;

                    var overall_color_actual        = rating_color(overall_curr_rating);
                    var easiness_color_actual       = rating_color(easiness_curr_rating);
                    var toughness_color_actual      = rating_color(toughness_curr_rating);
                    var clarity_color_actual        = rating_color(clarity_curr_rating);
                    var helpfulness_color_actual    = rating_color(helpfulness_curr_rating);

                    var comments_from_users         = [];
                    var date_comments_posted        = [];

                    for(var i = 0; i < body.comments_retrieved.length; i++) {
                        comments_from_users.push(body.comments_retrieved[i].content);
                        date_comments_posted.push(body.comments_retrieved[i].date_as_str);
                    }

                    var number_of_comments          = comments_from_users.length;

                    renderPage (res, courseName, everyStartingLetterToUpperCase(prof_full_name), course_offering_time, 
                                overall_curr_rating, selected_university, course_department, comments_from_users, 
                                number_of_comments, date_comments_posted, date, overall_color_actual, course_descr, 
                                overall_num_users_rated, easiness_curr_rating, clarity_curr_rating, toughness_curr_rating, 
                                helpfulness_curr_rating, easiness_color_actual, toughness_color_actual, clarity_color_actual, 
                                helpfulness_color_actual
                    );
                } else if(body.grant_type == 'Course not in session') {
                    /* Display an error that the course is not found in the selected session */
                    res.json({"Message":body.grant_type});
                } else if(body.grant_type == 'course not found') {
                    /* Display an error that the course was not found for the selected university */
                    res.json({"Message":body.grant_type});
                } else {
                    /* Display whatever error the grant type is about to the user and let them know to try again */
                    res.json({"Message":body.grant_type});
                }
            }
        });
    });



    /* -------------------------------------- */
    /* Route that handles Rating a Professor  */
    /* -------------------------------------- */
    router.post("/peeraide/user_rated", function (req,res) {

        var easiness_rating         = req.body.rating;
        var clarity_rating          = req.body.rating1;
        var toughness_rating        = req.body.rating2;
        var helpfulness_rating      = req.body.rating3;
        var overall_rating          = req.body.rating4;
        
        var postData = {
            courseTitles: courseDept,
            courseCodes: courseCode,
            chosenUniversity: selected_university,
            courseSession: course_offering_time,
            professorName: profsNameChosen,
            profsEasiness: easiness_rating,
            profsClarity: clarity_rating,
            profsToughness: toughness_rating,
            profsHelpfulness: helpfulness_rating,
            profsOverallRating: overall_rating
        }

        var url = 'https://peeraide.herokuapp.com/peeraide_api/peeraide_courses_handler/instructor_rating';
        var options = {
            method: 'post',
            body:   postData,
            json:   true,
            url:    url
        }

        request(options, function (err, res1, body) {
            if (err) {
                console.log(err);
            } else {
                if(body.grant_type == 'Rating successful') {

                    overall_curr_rating             = body.rating_result.overall_p_rating;
                    easiness_curr_rating            = body.rating_result.easiness_r;
                    toughness_curr_rating           = body.rating_result.toughness_r;
                    clarity_curr_rating             = body.rating_result.clarity_r;
                    helpfulness_curr_rating         = body.rating_result.helpfulness_rating;
                    overall_num_users_rated         = body.rating_result.overall_num_users_r;

                    var overall_color_actual        = rating_color(body.rating_result.overall_p_rating);
                    var easiness_color_actual       = rating_color(body.rating_result.easiness_r);
                    var toughness_color_actual      = rating_color(body.rating_result.toughness_r);
                    var clarity_color_actual        = rating_color(body.rating_result.clarity_r);
                    var helpfulness_color_actual    = rating_color(body.rating_result.helpfulness_rating);

                    var comments_from_users         = [];
                    var date_comments_posted        = [];

                    for(var i = 0; i < body.comments_retrieved.length; i++) {
                        comments_from_users.push(body.comments_retrieved[i].content);
                        date_comments_posted.push(body.comments_retrieved[i].date_as_str);
                    }

                    var number_of_comments          = comments_from_users.length;

                    renderPage (res, courseName, everyStartingLetterToUpperCase(prof_full_name), course_offering_time, 
                                overall_curr_rating, selected_university, course_department, comments_from_users, 
                                number_of_comments, date_comments_posted, date, overall_color_actual, course_descr, 
                                overall_num_users_rated, easiness_curr_rating, clarity_curr_rating, toughness_curr_rating, 
                                helpfulness_curr_rating, easiness_color_actual, toughness_color_actual, clarity_color_actual, 
                                helpfulness_color_actual
                    );
                } else {
                    /* Render an error page with whatever error that the body.grant_type returns */
                }
            }
        });
    });



    /* -------------------------------------------- */
    /* Route that handles Commenting on a Professor */
    /* -------------------------------------------- */
    router.post("/peeraide/users_comment", function (req, res) {

        var user_feedback   = req.body.feedback;

        var postData        = {
            peerFeedBack:       user_feedback,
            courseTitles:       courseDept,
            courseCodes:        courseCode,
            chosenUniversity:   selected_university,
            courseSession:      course_offering_time,
            professorName:      profsNameChosen
        }

        var url     = 'https://peeraide.herokuapp.com/peeraide_api/peeraide_courses_handler/feedback_on_instructor';
        var options = {
            method: 'post',
            body:   postData,
            json:   true,
            url:    url
        }

        request(options, function (err, res1, body) {
            if (err) {
                console.log(err);
            } else {
                if(body.grant_type == 'comment successfully posted') {
                    overall_curr_rating             = body.course_data.overall_curr_rating;
                    easiness_curr_rating            = body.course_data.easiness_curr_rating;
                    toughness_curr_rating           = body.course_data.toughness_curr_rating;
                    clarity_curr_rating             = body.course_data.clarity_curr_rating;
                    helpfulness_curr_rating         = body.course_data.helpfulness_curr_rating;
                    courseName                      = body.course_data.courseName;
                    overall_num_users_rated         = body.course_data.overall_num_users_rated;


                    prof_full_name                  = body.course_data.professor_joined_full_name;
                    course_offering_time            = body.course_data.courseSession;
                    course_department               = body.course_data.cDep;
                    course_descr                    = body.course_data.course_description;
                    selected_university             = body.course_data.chosenUniveristy;

                    var overall_color_actual        = rating_color(overall_curr_rating);
                    var easiness_color_actual       = rating_color(easiness_curr_rating);
                    var toughness_color_actual      = rating_color(toughness_curr_rating);
                    var clarity_color_actual        = rating_color(clarity_curr_rating);
                    var helpfulness_color_actual    = rating_color(helpfulness_curr_rating);

                    var comments_from_users         = [];
                    var date_comments_posted        = [];

                    for(var i = 0; i < body.comments_retrieved.length; i++) {
                        comments_from_users.push(body.comments_retrieved[i].content);
                        date_comments_posted.push(body.comments_retrieved[i].date_as_str);
                    }

                    var number_of_comments          = comments_from_users.length;

                    renderPage (res, courseName, everyStartingLetterToUpperCase(prof_full_name), course_offering_time, 
                                overall_curr_rating, selected_university, course_department, comments_from_users, 
                                number_of_comments, date_comments_posted, date, overall_color_actual, course_descr, 
                                overall_num_users_rated, easiness_curr_rating, clarity_curr_rating, toughness_curr_rating, 
                                helpfulness_curr_rating, easiness_color_actual, toughness_color_actual, clarity_color_actual, 
                                helpfulness_color_actual
                    );
                } else {
                    /* NOTE display and error using the grant type error and let them know to try again later */
                }
            }
        });
    });
}


/* Helper function to be called when a page is to be rendered with objects 
 * Passed into the request to be assessed by each page as well */
function renderPage(response, courseName, prof_full_name, course_offering_time, real_rating, selected_university, course_department, comments_from_users, number_of_comments,date_format, date, rating_color, cDescription, total_num_user_rating, e_rating, c_rating, t_rating, h_rating, easiness_color, toughness_color, clarity_color, helpfulness_color) {
    response.render('pages/course_page', {course_name:              courseName.toUpperCase(), 
                                          instructors_name:         prof_full_name,
                                          offering_time_course:     course_offering_time + " " + date.getFullYear(),
                                          rating_val:               real_rating,
                                          color:                    rating_color,
                                          course_description:       cDescription,
                                          chosen_uni:               selected_university,
                                          department:               "Department - " + course_department,
                                          user_comm:                comments_from_users,
                                          total_comments:           number_of_comments,
                                          num_individuals_rated:    total_num_user_rating,
                                          date_posted:              date_format,
                                          e_rating_val:             e_rating,
                                          t_rating_val:             t_rating,
                                          c_rating_val:             c_rating,
                                          h_rating_val:             h_rating,
                                          e_color:                  easiness_color,
                                          t_color:                  toughness_color,
                                          c_color:                  clarity_color,
                                          h_color:                  helpfulness_color
    });
}

/* Helper function to determine what color the rating circle will
 * be depending on the current rated number of how easy the prof
 * is.
 */
function rating_color(recentRating) {
    var recent_color_actual;

    if(recentRating >= config.minLowRated && recentRating <= config.maxLowRated) {
        recent_color_actual = config.poorlyRatedColor;
    } else if(recentRating >= config.minAverageRated && recentRating <= config.maxAverageRated) {
        recent_color_actual = config.averagelyRatedColor;
    } else if(recentRating >= config.minExcellentRated && recentRating <= config.maxExcellentRated) {
        recent_color_actual = config.excellentlyRatedColor;
    }
    return recent_color_actual;
}


/* Function to capitalize the first letter of every string before a space
 * is encountered.
 */
function everyStartingLetterToUpperCase(desiredStr) {
    return desiredStr.replace(/\w\S*/g, function(txt){ 
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

module.exports = PEER_AIDE_SEARCH_COURSES;