const Campground = require('./models/campground')
const Review = require('./models/review')
const ExpressError = require('./utils/ExpressError')
const { campgroundSchema, reviewSchema } = require('./schemas.js')

const validateCampground = function (req, res, next) {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const validateReview = function (req, res, next) {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in!')
        return res.redirect('/login')
    } else {
        next()
    }
}

const isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/campgrounds/${campground._id}`)
    }
    next()
}

const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const campground = await Campground.findById(id)
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/campgrounds/${campground._id}`)
    }
    next()
}


module.exports.isLoggedIn = isLoggedIn
module.exports.isAuthor = isAuthor
module.exports.validateCampground = validateCampground
module.exports.validateReview = validateReview
module.exports.isReviewAuthor = isReviewAuthor