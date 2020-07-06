import os, sys, random, io
from django.shortcuts import render
from django.http import HttpResponse
from PIL import Image, ImageDraw, ImageFont
from math import ceil

#验证码部分
#修改自https://github.com/tianyu0915/DjangoCaptcha，以支持python3
current_path = os.path.normpath(os.path.dirname(__file__))

class Captcha(object):

    def __init__(self, request):
        """   初始化,设置各种属性

        """
        self.django_request = request
        self.session_key = '_django_captcha_key'
        self.words = self._get_words()

        # 验证码图片尺寸
        self.img_width = 150
        self.img_height = 30
        self.type = 'number'

    def _get_font_size(self):
        """  将图片高度的80%作为字体大小

        """
        s1 = int(self.img_height * 0.8)
        s2 = int(self.img_width // len(self.code))
        return int(min((s1,s2)) + max((s1, s2)) * 0.05)

    def _get_words(self):
        """   读取默认的单词表

        """
        #TODO  扩充单词表

        file_path = os.path.join(current_path, 'words.list')
        f = open(file_path, 'r')
        return [line.replace('\n', '') for line in f.readlines()]

    def _set_answer(self,answer):
        """  设置答案
        
        """
        self.django_request.session[self.session_key] = str(answer)

    def _yield_code(self):
        """  生成验证码文字,以及答案
        
        """

        # 英文单词验证码
        def word():
            code = random.sample(self.words,1)[0]
            self._set_answer(code)
            return code


        # 数字公式验证码
        def number():
            m, n = 1, 50
            x = random.randrange(m, n)
            y = random.randrange(m, n)

            r = random.randrange(0 ,2)
            if r == 0:
                code = "%s - %s = ?" % (x, y)
                z = x - y
            else:
                code = "%s + %s = ?" % (x, y)
                z = x + y
            self._set_answer(z)
            return code

        fun = eval(self.type.lower())
        return fun()

    def display(self):
        """  生成验证码图片
        """

        # font color
        self.font_color = ['black', 'darkblue', 'darkred']

        # background color
        self.background = (random.randrange(230, 255), random.randrange(230, 255), random.randrange(230, 255))

        # font path
        self.font_path = os.path.join(current_path, 'timesbi.ttf')
        #self.font_path = os.path.join(current_path, 'Menlo.ttc')

        # clean
        self.django_request.session[self.session_key] = '' 

        # creat a image
        im = Image.new('RGB', (self.img_width, self.img_height), self.background)
        self.code = self._yield_code()

        # set font size automaticly
        self.font_size = self._get_font_size()

        # creat a pen
        draw = ImageDraw.Draw(im)

        # draw noisy point/line
        if self.type == 'word':
            c = int(8 // len(self.code) * 3) or 3
        elif self.type == 'number':
            c = 4

        for i in range(random.randrange(c - 2, c)):
            line_color = (random.randrange(0, 255), random.randrange(0, 255),random.randrange(0, 255))
            xy = (
                    random.randrange(0, int(self.img_width * 0.2)),
                    random.randrange(0, self.img_height),
                    random.randrange(3 * self.img_width // 4, self.img_width),
                    random.randrange(0, self.img_height)
                )
            draw.line(xy, fill = line_color, width = int(self.font_size * 0.1))
            #draw.arc(xy,fill = line_color, width = int(self.font_size * 0.1))
        #draw.arc(xy, 0, 1400, fill = line_color)

        # draw code
        j = int(self.font_size * 0.3)
        k = int(self.font_size * 0.5)
        x = random.randrange(j, k) #starts point
        for i in self.code:
            # 上下抖动量,字数越多,上下抖动越大
            m = int(len(self.code))
            y = random.randrange(1, 3)

            if i in ('+', '=', '?'):
                # 对计算符号等特殊字符放大处理
                m = ceil(self.font_size * 0.8)
            else:
                # 字体大小变化量,字数越少,字体大小变化越多
                m = random.randrange(0, int( 45 // self.font_size) + int(self.font_size // 5))

            self.font = ImageFont.truetype(self.font_path.replace('\\', '/'),self.font_size + int(ceil(m)))
            draw.text((x, y), i, font = self.font, fill = random.choice(self.font_color))
            x += self.font_size * 0.9

        del x
        del draw
        buf = io.BytesIO()
        im.save(buf, 'gif')
        buf.closed
        return HttpResponse(buf.getvalue(), 'image/gif')

    def check(self, code):
        """ 
        检查用户输入的验证码是否正确 
        """

        _code = self.django_request.session.get(self.session_key) or ''
        
        self.django_request.session[self.session_key] = ''
        return _code.lower() == str(code).lower()
#验证码部分 end

#仅在这个模块用到
def res(res_code, msg, data):
	res_data = {
		"code": res_code,
		"msg": msg,
	}

	if data:
		res_data["data"] = data
	return res_data

#回应请求成功
def res_success(msg, data = None):
	return res(0, msg, data)
#回应请求失败
def res_fail(res_code, msg, data = None):
	return res(res_code, msg, data)

#计算总页数
def page_count(count, page_size):
	if count % page_size == 0:
		return (count // page_size)
	else:
		return (count // page_size) + 1
