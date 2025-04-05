class ABC:
  def __init__(self,name,age):
    self.name=name
    self.age=age
  def fun(self):
    print(f"Name {self.name} \n Age {self.age})

ob=ABC("Abir",45)
ob.fun()
