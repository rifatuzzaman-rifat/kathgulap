
    // Theme Toggle
    $(document).ready(function() {
      if (localStorage.getItem('theme') === 'light') {
        $('body').addClass('light-mode');
        $('.theme-toggle i').removeClass('fa-moon').addClass('fa-sun');
        $('.theme-toggle').html('<i class="fas fa-sun"></i> Toggle Theme');
      } else {
        $('body').removeClass('light-mode');
        $('.theme-toggle i').removeClass('fa-sun').addClass('fa-moon');
        $('.theme-toggle').html('<i class="fas fa-moon"></i> Toggle Theme');
      }

      $('.theme-toggle').click(function() {
        $('body').toggleClass('light-mode');
        if ($('body').hasClass('light-mode')) {
          localStorage.setItem('theme', 'light');
          $('.theme-toggle i').removeClass('fa-moon').addClass('fa-sun');
          $('.theme-toggle').html('<i class="fas fa-sun"></i> Toggle Theme');
        } else {
          localStorage.setItem('theme', 'dark');
          $('.theme-toggle i').removeClass('fa-sun').addClass('fa-moon');
          $('.theme-toggle').html('<i class="fas fa-moon"></i> Toggle Theme');
        }
      });
    });

    // Cart Management
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartUI() {
      const $cartItems = $('.cart-items');
      $cartItems.empty();
      let total = 0;
      let itemCount = 0;

      if (cart.length === 0) {
        $('.empty-cart').show();
        $('.cart-items').hide();
        $('.cart-footer').hide();
      } else {
        $('.empty-cart').hide();
        $('.cart-items').show();
        $('.cart-footer').show();

        cart.forEach((item, index) => {
          const itemTotal = item.price * item.quantity;
          total += itemTotal;
          itemCount += item.quantity;
          const imageSrc = item.number.replace('#', '') + '.jpg'; // e.g., #001 -> 001.jpg
          $cartItems.append(`
            <li class="cart-item" data-index="${index}">
              <img src="${imageSrc}" alt="${item.name}" class="cart-item-img">
              <div class="info">
                <h3>${item.name}</h3>
                <p>Number: ${item.number}</p>
                <p>Price: $${item.price} x ${item.quantity} = $${itemTotal}</p>
              </div>
              <div class="quantity">
                <button class="decrease">-</button>
                <span>${item.quantity}</span>
                <button class="increase">+</button>
              </div>
              <i class="fas fa-trash remove-btn"></i>
            </li>
          `);
        });
      }

      $('.cart-footer .total').text(`Total: $${total}`);
      $('.cart-icon .badge').text(itemCount);
      saveCart();
    }

    // কার্টে যোগ করুন
    $('.add-to-cart-btn').click(function() {
      const name = $(this).data('name');
      const number = $(this).data('number');
      const price = parseFloat($(this).data('price'));
      const existingItem = cart.find(item => item.number === number);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name, number, price, quantity: 1 });
      }

      updateCartUI();
      $('.cart-icon').addClass('animate__animated animate__bounce');
    });

    // Cart Modal Toggle
    $('.cart-icon').click(function() {
      $('.cart-modal').fadeToggle();
      $('.overlay').fadeToggle();
      if ($('.cart-modal').is(':visible')) {
        $('.overlay').css('background', 'rgba(0,0,0,0.9)'); // Darker overlay
        $('.cart-modal .popup-close').focus();
      } else {
        $('.overlay').css('background', 'rgba(0,0,0,0.7)'); // Reset to default overlay
      }
    });

    // Close Cart Modal
    $('.cart-modal .popup-close, .overlay').click(function(e) {
      // Prevent closing overlay if sidebar is clicked
      if ($(e.target).hasClass('overlay') && $('.sidebar').hasClass('active')) {
        return;
      }
      $('.cart-modal').fadeOut();
      $('.overlay').fadeOut();
      $('.overlay').css('background', 'rgba(0,0,0,0.7)'); // Reset overlay
    });

    // Quantity Adjustments
    $('.cart-items').on('click', '.increase', function() {
      const index = $(this).closest('.cart-item').data('index');
      cart[index].quantity += 1;
      updateCartUI();
    });

    $('.cart-items').on('click', '.decrease', function() {
      const index = $(this).closest('.cart-item').data('index');
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1);
      }
      updateCartUI();
    });

    // Remove Item
    $('.cart-items').on('click', '.remove-btn', function() {
      const index = $(this).closest('.cart-item').data('index');
      cart.splice(index, 1);
      updateCartUI();
    });

    // Clear Cart
    $('.clear-cart').click(function() {
      cart = [];
      updateCartUI();
    });

    // Proceed to Checkout
    $('.checkout-btn').click(function() {
      if (cart.length === 0) return;
      let cartMessage = 'Order Details:\n';
      cart.forEach(item => {
        cartMessage += `Product: ${item.name}, Product Number: ${item.number}, Quantity: ${item.quantity}\n`;
      });
      $('#order-product').text('Cart Items');
      $('#order-number').text('');
      $('.order-popup').fadeIn();
      $('.cart-modal').fadeOut();
      $('.overlay').fadeIn().css('background', 'rgba(0,0,0,0.7)'); // Reset overlay for order popup
      $('#customer-phone').focus();
      $('.order-form').data('cart-message', cartMessage);
    });

    // Hamburger Animation (Left-Sliding Sidebar)
    $('.hamburger').click(function() {
      $(this).toggleClass('active');
      $('.sidebar').toggleClass('active');
      if ($('.sidebar').hasClass('active')) {
        $('.sidebar a').first().focus();
      }
    });

    // Smooth Scroll (Close Sidebar on Link Click)
    $('.sidebar a').click(function(e) {
      e.preventDefault();
      let target = $(this).attr('href');
      $('html, body').animate({scrollTop: $(target).offset().top - 60}, 800);
      $('.sidebar').removeClass('active');
      $('.hamburger').removeClass('active');
    });

    // Filter Products
    $('.filter-btn').click(function() {
      $('.filter-btn').removeClass('active');
      $(this).addClass('active');
      let filter = $(this).data('filter');
      $('.product-card').each(function() {
        if (filter === 'all' || $(this).data('category') === filter) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    });

    // Search Products
    $('#search').on('input', function() {
      let query = $(this).val().toLowerCase();
      $('.product-card').each(function() {
        let name = $(this).find('h3').text().toLowerCase();
        let category = $(this).data('category').toLowerCase();
        if (name.includes(query) || category.includes(query)) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    });

    // Sort Products
    $('#sort').change(function() {
      let value = $(this).val();
      let $grid = $('.product-grid');
      let $cards = $grid.children('.product-card');
      $cards.sort(function(a, b) {
        let priceA = parseFloat($(a).find('p').text().replace('$', ''));
        let priceB = parseFloat($(b).find('p').text().replace('$', ''));
        if (value === 'price-low') return priceA - priceB;
        if (value === 'price-high') return priceB - priceA;
        return 0;
      });
      $grid.empty().append($cards);
    });

    // Custom Gallery
    $('.gallery-img').click(function() {
      $('.gallery-modal img').attr('src', $(this).attr('src'));
      $('.gallery-modal').fadeIn();
      $('.overlay').fadeIn();
      $('.gallery-modal .close').focus();
    });
    $('.gallery-modal .close').click(function() {
      $('.gallery-modal').fadeOut();
      $('.overlay').fadeOut();
    });

    // Order Popup (for product card buttons)
    $('.order-btn').not('#details-order-btn').click(function() {
      let product = $(this).data('name');
      let number = $(this).data('number');
      $('#order-product').text(product);
      $('#order-number').text(number);
      $('.order-popup').fadeIn();
      $('.overlay').fadeIn();
      $('#customer-phone').focus();
      $('.order-form').data('cart-message', `Order Details:\nProduct: ${product}, Product Number: ${number}, Quantity: 1\n`);
    });

    // Details Popup "অর্ডার করুন" Button (close details popup, open order popup)
    $('#details-order-btn').click(function() {
      let product = $(this).data('name');
      let number = $(this).data('number');
      $('#order-product').text(product);
      $('#order-number').text(number);
      $('.details-popup').fadeOut();
      $('.order-popup').fadeIn();
      $('.overlay').fadeIn();
      $('#customer-phone').focus();
      $('.order-form').data('cart-message', `Order Details:\nProduct: ${product}, Product Number: ${number}, Quantity: 1\n`);
    });

    // Order Form Submission
    $('.order-form').submit(function(e) {
      e.preventDefault();
      let phone = $('#customer-phone').val();
      let email = $('#customer-email').val();
      let address = $('#customer-address').val();
      let cartMessage = $(this).data('cart-message') || '';
      let message = `${cartMessage}Phone: ${phone}\nEmail: ${email}\nAddress: ${address}`;
      
      $('.email-btn').attr('href', `mailto:rifatuzzaman31416@gmail.com?subject=Order: Cart Items&body=${encodeURIComponent(message)}`);
      $('.whatsapp-btn').attr('href', `https://wa.me/+8801928375950?text=${encodeURIComponent(message)}`);
      $('.facebook-btn').attr('href', `https://m.me/kathgulap.jewellery?text=${encodeURIComponent(message)}`);
      
      $('.order-form').hide();
      $('.order-options').show();
      $('.email-btn').focus();
    });

    // Warning Modal for Order Options
    let currentLink = '';
    $('.order-options a').click(function(e) {
      e.preventDefault();
      currentLink = $(this).attr('href');
      let method = $(this).data('method');
      let warningMessage = '';
      switch(method) {
        case 'email':
          warningMessage = 'You will need Gmail or your mail server to use this feature.';
          break;
        case 'whatsapp':
          warningMessage = 'You will need web WhatsApp or the app installed on your device.';
          break;
        case 'facebook':
          warningMessage = 'You will need Messenger or web Facebook to use this feature.';
          break;
      }
      $('#warning-message').text(warningMessage);
      $('.warning-modal').fadeIn();
      $('.overlay').fadeIn();
      $('.warning-modal .okay-btn').focus();
    });

    $('.warning-modal .okay-btn').click(function() {
      $('.warning-modal').fadeOut();
      $('.overlay').fadeOut();
      window.open(currentLink, '_blank');
      $('.order-popup').fadeOut();
      $('.order-form').show();
      $('.order-options').hide();
      $('.order-form')[0].reset();
      cart = []; // Clear cart after successful order
      updateCartUI();
    });

    $('.warning-modal .cancel-btn').click(function() {
      $('.warning-modal').fadeOut();
      $('.order-popup').fadeOut();
      $('.overlay').fadeOut();
      $('.order-form').show();
      $('.order-options').hide();
      $('.order-form')[0].reset();
    });

    // Details Popup
    $('.details-btn').click(function() {
      $('.details-popup h3').text($(this).data('name'));
      $('.details-popup img').attr('src', $(this).data('img'));
      $('.details-popup .desc').text('N.B. ' + $(this).data('desc'));
      $('.details-popup .price').text('মূল্য: ' + $(this).data('price'));
      $('#details-order-btn').data('number', $(this).data('number'));
      $('.details-popup').fadeIn();
      $('.overlay').fadeIn();
      $('#details-order-btn').focus();
    });

    $('.details-popup .popup-close').click(function() {
      $('.details-popup').fadeOut();
      $('.overlay').fadeOut();
    });

    // Close Popups
    $('.order-popup .popup-close').click(function() {
      $('.order-popup').fadeOut();
      $('.overlay').fadeOut();
      $('.order-form').show();
      $('.order-options').hide();
      $('.order-form')[0].reset();
    });

    // Contact Form Submission
    $('#contact-form').submit(function(e) {
      e.preventDefault();
      let name = $(this).find('input[name="name"]').val();
      let email = $(this).find('input[name="email"]').val();
      let message = $(this).find('textarea[name="message"]').val();
      let body = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
      window.location.href = `mailto:ankhiarifa39@gmail.com?subject=Contact Form Submission&body=${encodeURIComponent(body)}`;
      this.reset();
    });

    // Back to Top
    $(window).scroll(function() {
      if ($(this).scrollTop() > 200) {
        $('.back-to-top').fadeIn();
      } else {
        $('.back-to-top').fadeOut();
      }
    });

    $('.back-to-top').click(function() {
      $('html, body').animate({scrollTop: 0}, 800);
      $('.back-to-top').focus();
    });

    // Initial Cart Update
    updateCartUI();
  
