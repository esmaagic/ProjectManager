const User = require('../models/User');
const Message = require('../models/Message');

/*exports.sendMessage = async (req,res)=>{
    try {
        const sender = await User.findById(req.session.user.id)
        const receiver = await User.findById(req.params.receiverId)
        const {message} = req.body

        const newMessage = new Message({
            sender,
            receiver,
            message
        })
        await newMessage.save()
        res.send(message,sender,receiver)

    } catch (err) {
        throw new Error(`Error sending message: ${err}`);
    }
}*/

exports.getChatHistory = async(req,res)=>{
    try {
        const {receiverId } = req.params;
        // Assuming senderId and receiverId are passed as route parameters
        const senderId = req.session.user._id
        // Find all messages between the sender and receiver
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).populate('sender receiver')
            .sort({ timestamp: 1 }); // Populate sender and receiver fields with user details

        res.status(200).json({messages} );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getChatUsers = (req,res) => {

    const sender = req.session.user._id
    const receiver = req.params.receiverId

    res.status(200).json({sender,receiver})
}


exports.renderChat = async (req,res)=>{
    const receiverId = req.params.receiverId;
    const receiver = await User.findById(receiverId);
    res.render('chat', {receiver, receiverId})
}


exports.findUserByUsername = async(req,res)=>{
    const user = await User.findOne({username: req.params.username})
    const userId = user._id;
    res.status(200).json({userId})
}